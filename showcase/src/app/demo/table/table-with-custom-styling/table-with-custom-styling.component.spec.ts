import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TableWithCustomStylingComponent } from "./table-with-custom-styling.component";

describe("TableWithCustomStylingComponent", () => {
	let component: TableWithCustomStylingComponent;
	let fixture: ComponentFixture<TableWithCustomStylingComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TableWithCustomStylingComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TableWithCustomStylingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
