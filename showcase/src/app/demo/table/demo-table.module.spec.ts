import { DemoTableModule } from "./demo-table.module";

describe("DemoTableModule", () => {
	let demoTableModule: DemoTableModule;

	beforeEach(() => {
		demoTableModule = new DemoTableModule();
	});

	it("should create an instance", () => {
		expect(demoTableModule).toBeTruthy();
	});
});
