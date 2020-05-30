# FormDataJSON Class
Simple (extendable) FormData -> JSON converter. Works on files for binary-safe base64 conversion.

## Example Usage
```js
import FormDataJSON from "./form-data-json.js";

const form = document.querySelector("form");
form.addEventListener("submit", async e => {
	e.preventDefault();

	const fData = new FormData(form);
	const fDataJSON = new FormDataJSON(fData);
	let jsonRep = await fDataJSON.getAsJSON();

	console.log(jsonRep);
})
```
