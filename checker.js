function review(text) {
  const notes = [];
  const rules = [
    [/\b(he|she|it) (go|do|have|are|were going)\b/gi, (_,s,v)=>s+" "+({go:"goes",do:"does",have:"has",are:"is","were going":"was going"}[v.toLowerCase()]),"Match the verb to the singular subject."],
    [/\b(they|we|you) (is|has)\b/gi, (_,s,v)=>s+" "+(v.toLowerCase()==="is"?"are":"have"),"Check subject–verb agreement."],
    [/\b(did|does) went\b/gi, (_,v)=>v+" go","Use the base verb after an auxiliary."],
    [/\b(teh|recieve|grammer|seperate|becuase)\b/gi, w=>({teh:"the",recieve:"receive",grammer:"grammar",seperate:"separate",becuase:"because"}[w.toLowerCase()]),"Correct the spelling."],
    [/\bi\b/g, ()=>"I","Capitalize the pronoun I."],
    [/\b(the|a|an) +\1\b/gi, (_,w)=>w,"Remove the repeated article."],
    [/(^|[.!?]\s+)([a-z])/g, (_,space,w)=>space+w.toUpperCase(),"Capitalize the first word of the sentence."]
  ];
  for (const [pattern,replace,reason] of rules) text=text.replace(pattern,(...args)=>{
    const from=args[0],to=replace(...args);
    notes.push(from.trim()+" → "+to.trim()+". "+reason);
    return to;
  });
  return {text,notes};
}
