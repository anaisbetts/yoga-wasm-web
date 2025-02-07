import initYoga from "./index.js";
import yogaWasm from "./yoga-wasm.js"; 

const Yoga = await initYoga(
  Buffer.from(yogaWasm, "base64")
);

export * from "./yoga/javascript/src_js/generated/YGEnums.js";
export default Yoga;
