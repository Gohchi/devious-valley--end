import { Buffer } from "buffer";

let title = 'DEVIOUS VALLEƳ';

const replaceAt = (position, char) => {
  let array = [...title];
  array[position] = char;
  title = array.join('');
}

let saved;

if(localStorage["deity"]){
  const buffer = Buffer.from(localStorage["deity"], 'base64');
  saved = JSON.parse(buffer.toString());
}

const deity = saved || {
  // "Draconis": "SEALED",
  // "Ego": "CHANGED",
  // "Ventum": "DISAPPEARED",
  // "Ignis": "PURIFIED_PAST",
  // // "Ignis": "PURIFIED_PRESENT",
  // // "Ignis": "DEFEATED",
  // // "Ignis": "REVIVED",
  // "Oceanum": "PURIFIED_PAST",
  // // "Oceanum": "PURIFIED_PRESENT",
  // // "Oceanum": "DEFEATED",
  // // "Oceanum": "RITUAL",
  // // "Oceanum": "REVIVED",
  // "Umbra": "PURIFIED_PAST",
  // // "Umbra": "PURIFIED_PRESENT",
  // // "Umbra": "POSSESSION",
  // // "Umbra": "LIBERATION",
  // "Sol": "TENEBRIS",
  "VAL": "ORIGINAL",
  // "VAL": "DEFEATED",
  "LEY": "ORIGINAL",
  // "LEY": "DEFEATED",
};

if(!localStorage["deity"]) {
  const data = JSON.stringify(deity);
  const b64 = Buffer.from(data).toString('base64');
  localStorage["deity"] = b64;
}

export const getTitleByStatus = () => {
  if(deity["Draconis"] === "SEALED") {
    replaceAt(0, "\u00D0");  // Ð
  }

  if(deity["Ego"] === "CHANGED") {
    replaceAt(1, "\u01b7"); // Ʒ
  }

  if(deity["Ventum"] === "DISAPPEARED") {
    replaceAt(2, "\u0263"); // ɣ
  }

  switch(deity["Ignis"]) {
    case "PURIFIED_PAST":
      replaceAt(3, "\u0268"); // ɨ
      break;
    case "PURIFIED_PRESENT":
      replaceAt(3, "\u0197"); // Ɨ
      break;
    case "DEFEATED":
      replaceAt(3, "\u01c3"); // ǃ
      break;
    case "REVIVED":
      replaceAt(3, "\u01C2"); // ǂ
      break;
  }

  switch(deity["Oceanum"]) {
    case "PURIFIED_PAST":
      replaceAt(4, "\u0275"); // ɵ
      break;
    case "PURIFIED_PRESENT":
      replaceAt(4, "\u019F"); // Ɵ
      break;
    case "DEFEATED":
      replaceAt(4, "\u00D8"); // Ø
      break;
    case "RITUAL":
      replaceAt(4, "\u0278"); // ɸ
      break;
    case "REVIVED":
      replaceAt(4, "\u0298"); // ʘ
      break;
  }

  if(deity["Sol"] === "TENEBRIS"){
    replaceAt(6, "\u01a7"); // Ƨ
  }

  switch(deity["VAL"]) {
    case "ORIGINAL":
      replaceAt(9, "\u0245"); // Ʌ
      break;
    case "DEFEATED":
      replaceAt(9, "\u023A"); // Ⱥ
      break;
  }

  switch(deity["LEY"]) {
    case "ORIGINAL":
      replaceAt(12, "\u01a9"); // Ʃ
      break;
    case "DEFEATED":
      replaceAt(12, "\u0246"); // Ɇ
      break;
  }

  switch(deity["Umbra"]) {
    case "PURIFIED_PAST":
      replaceAt(5, "\u0289"); // ʉ
      break;
    case "PURIFIED_PRESENT":
      replaceAt(5, "\u0244"); // Ʉ
      break;
    case "POSSESSION":
      replaceAt(4, "\u0223"); // ȣ
      replaceAt(5, "");
      break;
    case "LIBERATION":
      replaceAt(4, "\u014c"); // Ō
      replaceAt(5, "\u016a"); // Ū
      break;
  }
  
  return title;
}
