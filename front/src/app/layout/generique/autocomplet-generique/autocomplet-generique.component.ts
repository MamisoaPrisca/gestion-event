import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormSelectDirective } from "@coreui/angular";
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'generique-autocomplet',
  imports: [
    FormSelectDirective,
    FormsModule,
    IconDirective
  ],
  templateUrl: './autocomplet-generique.component.html',
  styleUrl: './autocomplet-generique.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompletGeneriqueComponent),
      multi: true
    }
  ]
})
export class AutocompletGeneriqueComponent implements ControlValueAccessor , OnChanges {
  @Input() items: any[] = [];
  @Input() placeholder: string = '';
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();
  @Input() valueColumn: string = "";
  @Input() labelColumn: string = "";
  @Input() class:string="";
  selected: any[] = [];
  filteredItems: any[] = [];

  showDropdown = false;

  constructor(private eRef: ElementRef) {}
  onChange: any = () => {};
  onTouched: any = () => {};
  isDisabled = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && this.value && !this.selected.length) {
      const found = this.items.find(i => this.getValue(i) === this.value);
      if (found) {
        this.selected = [found];
      }
    }
  }

  
  // Appelé quand le parent écrit une valeur dans le champ
  writeValue(value: any): void {
    this.value = value;
    if(this.valueColumn){
      this.selected = this.items.filter(item =>
        item[this.valueColumn]===value
      );
    }
    else{
      this.selected = value ? [value] : [];
    }
    
  }

  // Angular t’envoie les fonctions à appeler quand la valeur ou le focus changent
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Pour gérer l’état disabled
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // 🔹 Quand l'utilisateur tape
  onInputChange(event: any) {
    const query = event.target.value.toLowerCase().trim();
    if (query.length > 0) {
      this.filteredItems = this.items.filter(item =>
        item[this.labelColumn].toLowerCase().includes(query)
      );
      this.showDropdown = true;
    } else {
      // Affiche tout si champ vide
      this.filteredItems = [...this.items];
      this.showDropdown = true;
    }
  }

  // 🔹 Quand l'utilisateur focus l'input
  onInputFocus() {
    this.filteredItems = [...this.items]; // afficher tous les items
    this.showDropdown = this.filteredItems.length > 0;
  }

  // 🔹 Sélection d'un item
 selectItem() {
    if (this.selected.length > 0) {
      this.value = this.getValue(this.selected[0]);
    } else {
      this.value = null;
    }
    this.valueChange.emit(this.value);
    this.onChange(this.value); // 🔹 informe le parent formControl
    this.onTouched();
    this.showDropdown = false;
  }

  getLabel(){
    if (this.selected.length > 0) {
      return this.selected[0][this.labelColumn]
    }
    else {
      return ''
    }
  }

  // 🔹 Fermer le dropdown si clic en dehors
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  // 🔹 Toggle dropdown quand clic sur un bouton
  toggleDropdown() {
    if (!this.showDropdown) {
      this.filteredItems = [...this.items];
    }
    this.showDropdown = !this.showDropdown;
  }

  // 🔹 Effacer la sélection
  clearSelection() {
    this.value = null;
    this.selected = [];
    this.valueChange.emit(this.value);
    this.onChange(this.value); // 🔹 idem
    this.onTouched();
    this.showDropdown = false;
  }

  getValue(object:any){
    if(this.valueColumn){
      return object[this.valueColumn]
    }
    return object
  }

}
