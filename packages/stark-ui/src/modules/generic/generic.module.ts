import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { StarkGenericSearchComponent } from "./components";
import { StarkActionBarModule } from "../action-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
	declarations: [StarkGenericSearchComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		StarkActionBarModule,
		TranslateModule,
		BrowserAnimationsModule
	],
	exports: [StarkGenericSearchComponent]
})
export class StarkGenericModule {}
