import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TableWithTranscludedActionBarComponent } from "./table-with-transcluded-action-bar.component";

describe("TableWithTranscludedActionBarComponent", () => {
	let component: TableWithTranscludedActionBarComponent;
	let fixture: ComponentFixture<TableWithTranscludedActionBarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TableWithTranscludedActionBarComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TableWithTranscludedActionBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
