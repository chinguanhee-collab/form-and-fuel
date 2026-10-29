/* Original schematic anatomy artwork. All geometry shares x=170 symmetry;
   the head, neck, torso and hit regions use the same coordinate system. */
const AnatomyMap=(()=>{
 // The outside of each arm and the inside return are one continuous contour.
 const bodyHalf="M155 66L155 88C153 97 138 100 123 104C107 108 98 117 94 131L87 157C83 171 76 187 73 200C70 211 66 220 62 231L48 269L44 280C40 288 39 296 40 304L42 314Q44 317 45 312L45 301L47 315Q49 317 50 312L50 300L53 313Q55 315 56 310L56 297L60 304Q64 307 65 303L60 291Q58 286 60 279L68 263C75 250 82 235 88 221C92 212 96 200 100 188L113 158C118 179 120 196 124 214L130 241C131 252 125 264 122 278C117 296 116 317 119 339L126 377C128 386 129 391 128 400C126 416 123 431 125 449L130 482L129 492C125 501 116 509 114 516Q113 522 123 522L145 521Q152 520 151 513L148 498L149 487L153 455C156 438 153 418 153 404C154 389 160 375 163 359L168 320L170 295L170 93Z";
 let activeMuscle='biceps';
 const head="M148 20C151 9 161 6 170 6C179 6 189 9 192 20C195 30 193 45 189 55C185 66 179 74 170 76C161 74 155 66 151 55C147 45 145 30 148 20Z";
 const headBack='M147 22C148 11 158 6 170 6C182 6 192 11 193 22L192 47Q189 63 182 72L158 72Q151 63 148 47Z';
 function region(key,d,mirror=false){const label=key==='neck'||key==='abs'?MUSCLES[key].name:`${MUSCLES[key].name}, ${mirror?'right':'left'} side`;return `<g class="muscle-shape ${activeMuscle===key?'active':''}" ${mirror?'transform="translate(340 0) scale(-1 1)"':''} data-muscle="${key}" role="button" tabindex="0" aria-label="${label}" aria-pressed="${activeMuscle===key}"><title>${MUSCLES[key].name}</title><path class="region-fill" d="${d}"/>${key==='neck'?`<path class="region-hit" d="${d}" aria-hidden="true"/>`:''}</g>`;}
 const pair=(key,d)=>region(key,d)+region(key,d,true);
 function create(selected,side,instance='main'){activeMuscle=selected;const token='anatomy-'+String(instance).replace(/[^a-zA-Z0-9_-]/g,'')+'-'+side;let out=`<title>${side==='front'?'Front':'Back'} muscle map</title><desc>Choose a muscle to read about its anatomy, growth and exercises. Use Tab and Enter for keyboard selection.</desc><defs><linearGradient id="anatomyBase" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4b4c58"/><stop offset="1" stop-color="#363742"/></linearGradient><linearGradient id="muscleTone" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#777782"/><stop offset="1" stop-color="#5c5d69"/></linearGradient></defs><g class="anatomy-base"><path d="${bodyHalf}"/><path d="${bodyHalf}" transform="translate(340 0) scale(-1 1)"/></g>`;
 if(side==='front'){
  out+=pair('shoulders','M125 105C110 106 101 114 96 127L88 153Q88 161 94 162C104 157 110 145 116 135Q125 119 141 114Q135 106 125 105Z');
  out+=pair('chest','M169 125C168 116 155 111 142 114C128 116 119 126 112 138Q104 151 96 157C106 156 115 166 126 172C139 179 156 176 164 168Q169 160 169 147Z');
  out+=pair('biceps','M96 162C104 163 107 172 103 184C99 197 93 211 85 219Q79 224 75 219C71 211 77 195 82 184Q88 168 96 162Z');
  out+=pair('forearms','M75 222Q81 226 87 222C83 239 73 258 62 274L56 284Q49 285 46 278C49 264 55 247 63 234Q68 225 75 222Z');
  out+=pair('obliques','M119 177Q129 185 143 187C141 199 138 209 141 222L145 247Q139 256 130 254C133 238 125 217 123 205Q120 191 119 177Z');
  out+=region('abs','M170 183C160 179 148 179 143 188C145 207 142 226 147 244C151 262 158 275 170 282C182 275 189 262 193 244C198 226 195 207 197 188C192 179 180 179 170 183Z');
  out+=pair('quads','M125 265C136 264 151 277 165 292C165 313 161 339 157 358L149 382Q146 394 140 394Q134 393 132 382Q128 386 126 377C119 351 115 320 120 291Z');
  out+=pair('calves','M129 402Q136 408 141 399C149 413 151 432 146 448C142 461 141 476 141 485L135 491Q131 480 130 468L126 443Q122 423 129 402Z');
 }else{
  out+=pair('back','M155 90C150 98 136 102 125 106Q140 113 150 130L169 148L169 111Z');
  out+=pair('shoulders','M124 105C108 108 99 119 95 132L88 157Q90 165 98 159C109 151 115 139 123 133L145 121Q136 108 124 105Z');
  out+=pair('back','M119 141Q132 137 145 148L168 164L168 224L153 251Q137 244 130 223C124 207 120 186 118 167Z');
  out+=pair('back','M162 166L168 170L168 269L155 264Q153 252 158 233L160 202Z');
  out+=pair('triceps','M97 162C106 166 107 177 103 188C98 202 93 214 85 221Q77 227 73 219C71 208 77 188 83 177Q89 164 97 162Z');
  out+=pair('forearms','M74 223Q82 229 87 223C82 241 73 260 61 276L56 284Q49 285 46 278C50 261 56 244 64 234Z');
  out+=pair('glutes','M126 256Q146 249 168 270L169 297C155 310 139 312 126 302Q119 296 122 281Z');
  out+=pair('hamstrings','M123 305Q143 316 165 301C166 324 160 350 156 368L149 388Q142 398 137 385Q131 391 127 378C119 352 116 327 123 305Z');
  out+=pair('calves','M129 401Q136 395 140 408Q146 401 149 411C155 427 149 444 143 458L138 479L135 489L131 472C130 459 124 446 125 429Q125 412 129 401Z');
 }
 // The neck is centered under the jaw; its visible boundary and hit target coincide.
 out+=region('neck',side==='front'?'M155 68Q170 81 185 68L185 88Q187 98 201 102L188 108Q177 110 170 119Q163 110 152 108L139 102Q153 98 155 88Z':'M156 65Q170 72 184 65L184 88L191 100L180 108L170 116L160 108L149 100L156 88Z');
 out+=`<g class="anatomy-head"><path d="${side==='back'?headBack:head}"/><path d="M148 37Q143 33 145 45L150 50M192 37Q197 33 195 45L190 50"/></g>`;
 const frontLines='M170 188L170 203M148 204Q158 200 168 205M172 205Q182 200 192 204M170 212L170 225M148 226Q158 222 168 227M172 227Q182 222 192 226M170 235L170 245M153 247Q160 245 168 250M172 250Q180 245 187 247M170 257L170 271M157 83Q159 101 167 113M183 83Q181 101 173 113M136 279C126 309 130 343 141 371M204 279C214 309 210 343 199 371M67 242L55 269M273 242L285 269';
 const backLines='M170 122L170 258M131 147Q137 161 152 173M209 147Q203 161 188 173M136 321Q129 347 140 376M204 321Q211 347 200 376M138 420L136 457M202 420L204 457';
 out+=`<g class="anatomy-detail" aria-hidden="true"><path d="${side==='front'?frontLines:backLines}"/><path d="M46 290L47 301M51 290L52 301M294 290L293 301M289 290L288 301M124 513Q133 515 142 513M216 513Q207 515 198 513"/></g>`;
 return out.replaceAll('id="anatomyBase"','id="'+token+'-base"').replaceAll('id="muscleTone"','id="'+token+'-tone"').replaceAll('class="anatomy-base"','class="anatomy-base" style="--anatomy-base-fill:url(#'+token+'-base)"').replaceAll('class="muscle-shape ','style="--muscle-fill:url(#'+token+'-tone)" class="muscle-shape ');
 }
 return {create};
})();
