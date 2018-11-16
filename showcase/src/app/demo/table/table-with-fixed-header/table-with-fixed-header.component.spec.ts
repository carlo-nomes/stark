import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TableWithFixedHeaderComponent } from "./table-with-fixed-header.component";

describe("TableWithFixedHeaderComponent", () => {
	let component: TableWithFixedHeaderComponent;
	let fixture: ComponentFixture<TableWithFixedHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TableWithFixedHeaderComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TableWithFixedHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
