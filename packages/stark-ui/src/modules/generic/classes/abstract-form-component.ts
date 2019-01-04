import { StarkLoggingService } from "@nationalbankbelgium/stark-core";

const _cloneDeep: Function = require("lodash/cloneDeep");
const _isEqual: Function = require("lodash/isEqual");

export abstract class AbstractStarkFormComponent<E> {
	public originalCopy: E;
	public workingCopy: E;

	protected constructor(public logger: StarkLoggingService) {}

	/**
	 * Set the form's original copy to the object passed as parameter (a deep cloned copy). Default: empty object ({})
	 * @param originalCopy - (optional) The object to be set as the form's original copy
	 */
	protected setOriginalCopy(originalCopy: E = <any>{}): void {
		this.originalCopy = originalCopy;
		this.workingCopy = _cloneDeep(this.originalCopy);
	}

	/**
	 * Revert the form's working copy back to the original copy (a deep clone copy)
	 */
	protected reset(): void {
		this.workingCopy = _cloneDeep(this.originalCopy);
	}

	/**
	 * Check whether the working copy is exactly the same as the original copy.
	 * Performs a deep comparison between the two objects to determine if they are equivalent.
	 */
	protected isDirty(): boolean {
		return !_isEqual(this.workingCopy, this.originalCopy);
	}
}
