const el=id=>document.getElementById(id);
const draft=el("draft"), mode=el("mode"), check=el("check");
let revision=0, model;
function reset(){
  revision++;
  el("result").hidden=true;
  el("notes").replaceChildren();
  el("status").textContent="Your corrections will appear here.";
  const n=draft.value.trim().split(/\s+/).filter(Boolean).length;
  el("count").textContent=n+" "+(n===1?"word":"words");
  el("help").textContent=mode.value==="ai"?"AI mode downloads an English correction model on first use. Review its suggestions for meaning.":"Quick rules check common English mistakes on your device.";
}
draft.oninput=mode.onchange=reset;
el("sample").onclick=()=>{draft.value="she go to the library every day. i study grammer with her.";reset();draft.focus()};
check.onclick=async()=>{
  const input=draft.value, current=revision;
  if(!input.trim()){el("status").textContent="Enter some English text first.";draft.focus();return}
  el("result").hidden=true;el("notes").replaceChildren();check.disabled=true;
  try{
    let corrected,notes=[];
    if(mode.value==="ai"){
      if(input.length>500)throw Error("AI mode supports short passages. Check up to 500 characters at a time.");
      el("status").textContent="Loading the model and checking your draft…";
      const {pipeline,env}=await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2");
      env.allowLocalModels=false;
      model??=await pipeline("text2text-generation","Xenova/grammar-synthesis-small");
      const prediction=await model("grammar: "+input,{max_new_tokens:256});
      corrected=prediction[0].generated_text.trim();
      if(!corrected)throw Error("No suggestion returned. Try Quick rules.");
    }else{const r=review(input);corrected=r.text;notes=r.notes}
    if(current!==revision)return;
    el("status").textContent=corrected===input?"No changes suggested.":notes.length?notes.length+" suggested edits":"Suggested AI revision";
    for(const note of notes){const item=document.createElement("li");item.textContent=note;el("notes").append(item)}
    el("output").textContent=corrected;el("result").hidden=false;
  }catch(e){if(current===revision)el("status").textContent=e.message.startsWith("AI mode supports")?e.message:"AI model unavailable. Check your connection or select Quick rules."}
  finally{check.disabled=false}
};
el("copy").onclick=async()=>{try{await navigator.clipboard.writeText(el("output").textContent);el("status").textContent="Corrected text copied."}catch{el("status").textContent="Select the corrected draft and copy it manually."}};
