class FormDataJSON{
	constructor(formData){
		this.formData = formData;
		this.preparedValues = {};
	}

	/**
	* Add a value that may already be a JSON object or other prepared data
	* that wasn't in the original form data
	* @param {string} key
	* @param {mixed} value
	*/
	addPreparedValue(key, value){
		this.preparedValues[key] = value;
	}

	/**
	* Returns a JSON representation of the formData
	* @return {object}
	*/
	async getAsJSON(){
		const finalObject = {};
		for (let entry of this.formData){
			let key = entry[0];
			let value = entry[1];
			if (typeof(value) === "object"){
				if ("constructor" in value){
					if (value.constructor.name === "File"){
						finalObject[key] = await this.getFileAsBase64(value);
					}else{
						throw `Unknown constructor conversion for ${value.constructor.name}`;
					}
				}else{
					throw `Unknown object conversion for ${value}`;
				}
			}else if (typeof(value) === "string" || typeof(value) === "number"){
				finalObject[key] = value;
			}else{
				throw `Unknown value type. Type is  ` + typeof(value);
			}
		}

		for (let key of Object.keys(this.preparedValues)){
			finalObject[key] = this.preparedValues[key];
		}

		return JSON.stringify(finalObject);
	}

	/**
	* Converts a file to base64
	* @param {File} file
	* @return {Promise}
	* @PromiseAccepted {string} in base64
	*/
	getFileAsBase64(file){
		return new Promise((accept, reject) => {
			const dataRegex = /data:.*\/.*;base64,/
			const fReader = new FileReader();

			fReader.addEventListener("load", () => {
				let result = fReader.result;
				result = result.replace(dataRegex, ""); // Just get the base64

				// Blank file?
				if (result === "data:"){
					result = "";
				}

				accept(result);
			}, false);

			fReader.readAsDataURL(file);
		});
	}
}

export default FormDataJSON;
