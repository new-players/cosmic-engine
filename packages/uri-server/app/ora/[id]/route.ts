
import path from 'path'
import AdmZip from 'adm-zip'
import xml2js from 'xml2js'
import sharp from 'sharp'

type LayerInfo = {
  src: string;
  name: string;
  visibility: string;
  x: string;
  y: string;
};

type ImageBufferWithOffset = {
buffer: Buffer;
x: number;
y: number;
};

const getStackNamesFromRootNode = (rootNode: any) => {
  const stackChildren = rootNode.stack

  if (!stackChildren) {
    return []
  }

  const stackNames: string[] = stackChildren.map((stack: any) => stack.$.name)
  return stackNames
}

const findLayerStack = (component: any, targetLayerName: string): any => {

  if (component.$.name === targetLayerName) {
    return component
  }

  if (component.stack) {
    for (const childStack of component.stack) {
      const result = findLayerStack(childStack, targetLayerName)
      if (result) {
        return result
      }
    }
  }

  return null
}

const getLayersFromXml = async (xmlBuffer: Buffer) => {
  const parser = new xml2js.Parser()
  const xmlString = xmlBuffer.toString()

  const result = await parser.parseStringPromise(xmlString)
  const rootNode = result?.image.stack[0].stack[0] // assumes a parent Root layer in the ORA file

  if (!rootNode) {
    throw new Error('Root node not found in stack.xml')
  }

  const stackNames = getStackNamesFromRootNode(rootNode)

  const allLayerInfoArray: Array<LayerInfo> = []

  for (const targetLayerName of stackNames) {
    const targetStack = findLayerStack(rootNode, targetLayerName)

    if (!targetStack) {
      continue
    }

    const layerComponents = targetStack.layer

    const layerInfoArray: Array<LayerInfo> = layerComponents
    .map((layer: any) => ({
      src: layer.$.src,
      name: layer.$.name,
      visibility: layer.$.visibility,
      x: layer.$.x,
      y: layer.$.y
    }))


    if (layerInfoArray.length > 0) {
      for (var i = 0; i < layerInfoArray.length; i++) {
          allLayerInfoArray.push(layerInfoArray[i])
      }
    }
  }

  return allLayerInfoArray
}

const getImageSizeFromXml = async (xmlBuffer: Buffer) => {
  const parser = new xml2js.Parser()
  const xmlString = xmlBuffer.toString()

  const result = await parser.parseStringPromise(xmlString)
  const imageComponent = result?.image

  if (!imageComponent) {
    throw new Error('No image component found in stack.xml')
  }

  const width = parseInt(imageComponent.$.w, 10)
  const height = parseInt(imageComponent.$.h, 10)

  return { width, height }
}

const combineImages = async (
  imageBuffersWithOffsets: ImageBufferWithOffset[],
  combinedWidth: number,
  combinedHeight: number
) => {
  let compositeImage = await sharp({
    create: {
      width: combinedWidth,
      height: combinedHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  const compositeOperations = imageBuffersWithOffsets.map((imageBufferWithOffset) => ({
    input: imageBufferWithOffset.buffer,
    left: imageBufferWithOffset.x,
    top: imageBufferWithOffset.y,
  }));

  compositeImage = await compositeImage.composite(compositeOperations).png();

  return compositeImage.toBuffer();
};

const selectImagesFromZip = async (zipPath: string, partsArray: Array<LayerInfo>, attributesArray:  any) => {
  const zip = new AdmZip(zipPath);
  const imageBuffersWithOffsets  = Array<ImageBufferWithOffset>();

// Extract the values from the attributesArray
const attributeValues = attributesArray.map((attribute: any) => attribute.value);
  

  for (const part of partsArray) {
    const entry = zip.getEntry(part.src);
    if (!entry?.isDirectory && attributeValues.includes(part.name)) {
      var layer : ImageBufferWithOffset = {buffer: entry?.getData() as Buffer, x: parseInt(part.x), y: parseInt(part.y)};

      imageBuffersWithOffsets .push({
          buffer: entry?.getData() as Buffer, x: parseInt(part.x), y: parseInt(part.y)
      });
    }
  }

  return imageBuffersWithOffsets ;
};  

const attributes = [
  { trait_type: "beast", value: "swamp_beast" },
  { trait_type: "fwheel", value: "desert_fwheel" },
  { trait_type: "bwheel", value: "plains_bwheel" },
  { trait_type: "body", value: "ice_body" },
  { trait_type: "cover", value: "swamp_cover" }
]

export async function GET(request: Request) {

  const zipPath = path.join(process.cwd(), 'assets', 'wagons.ora');

  try {
    const zip = new AdmZip(zipPath);
    const stackXmlEntry = zip.getEntry('stack.xml');
    const stackXmlBuffer = stackXmlEntry?.getData();

    const partsArray = (await getLayersFromXml(stackXmlBuffer as Buffer)).reverse();    
    const { width, height } = await getImageSizeFromXml(stackXmlBuffer as Buffer);
    const imageBuffers = await selectImagesFromZip(zipPath, partsArray, attributes);

    if (imageBuffers.length < 2) {

      return new Response(
        'Not enough images in the selected partsArray to combine',
        { headers: { 'content-type': 'text/javascript' } });      
    }      

    const combinedImageBuffer = await combineImages(imageBuffers, width, height);

    return new Response(
      combinedImageBuffer, 
      { headers: { 'content-type': 'image/png' } });

  } catch (error) {
    console.error('Error getting images from ZIP and combining them:', error);
  }
}