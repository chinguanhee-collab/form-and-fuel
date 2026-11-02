import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js';
env.allowLocalModels=false;
env.backends.onnx.wasm.numThreads=1;
let classifier=null;
self.onmessage=async({data})=>{
 try{
  if(!classifier){
   classifier=await pipeline('zero-shot-image-classification','Xenova/clip-vit-base-patch32',{
    dtype:'q8',device:'wasm',progress_callback:p=>{
     if(p.status==='progress')self.postMessage({type:'progress',message:`Downloading image recognition model · ${p.file?.includes('vision')?'vision model':p.file?.includes('text')?'text model':'model file'} ${Math.round(p.progress||0)}%. First use may take a few minutes.`});
     else if(p.status==='ready')self.postMessage({type:'progress',message:'Model ready. Comparing the meal photo with the food library…'});
    }
   });
  }
  self.postMessage({type:'progress',message:'Looking at your photo on this device. This can take a little time…'});
  const results=await classifier(data.photo,data.labels,{hypothesis_template:'a photo of {}'});
  self.postMessage({type:'result',results:results.slice(0,4)});
 }catch(e){classifier=null;self.postMessage({type:'error',message:String(e.message||e)});}
};
