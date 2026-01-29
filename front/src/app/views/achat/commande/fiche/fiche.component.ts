import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonCloseDirective, ButtonDirective, CardBodyComponent, CardComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, TableDirective } from '@coreui/angular';
import { LoaderService } from '../../../../util/service/loader.service';
import { CommandeFournisseurService } from '../../../../services/commande-fournisseur.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ProduitService } from '../../../../services/produit.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutocompletGeneriqueComponent } from '../../../../layout/generique/autocomplet-generique/autocomplet-generique.component';
import { DecimalPipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { EntrerComponent } from '../entrer/entrer.component';

@Component({
  selector: 'app-fiche',
  imports: [
    CardComponent,  
    CardBodyComponent, 
    ButtonDirective,
    TableDirective,
    FormControlDirective,
    ReactiveFormsModule,
    DecimalPipe,
    AutocompletGeneriqueComponent,
    IconDirective,FormsModule,
    ModalComponent,
    ButtonCloseDirective,
    ModalBodyComponent,
    EntrerComponent
  ],
  templateUrl: './fiche.component.html',
  styleUrl: './fiche.component.scss'
})
export class FicheComponent {
  idcommandeFournisseur:string="";
  commandeFournisseur:any;
  detailCommande:any[]=[];
  produit:any[]=[];
  form: FormGroup;
  editMode=false;
  

  constructor(
    private loaderService:LoaderService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private commandeFournisseurService : CommandeFournisseurService,
    private formBuilder:FormBuilder,

  ){
    this.idcommandeFournisseur = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.form = this.formBuilder.group({
        produit: ['', Validators.required],
        prix: ['',Validators.required],
        quantite: ['1',Validators.required],
        idVariante: [''],
        tva:['']
      });

  }
  ngOnInit(): void {
    this.getData();
    this.getDataProduit();
    this.getDataDetail();
  }

  getDataDetail(){
    this.loaderService.show();
    this.commandeFournisseurService.getAllDetail(this.idcommandeFournisseur)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.detailCommande=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    }); 
  }  

  getData(){
    this.loaderService.show();
    this.commandeFournisseurService.get(this.idcommandeFournisseur)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.commandeFournisseur=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    }); 
  }  

  // ----------------------- Supprimer  ------------------------
  supprimer(){
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le commande fournisseur "${this.commandeFournisseur.idCommandeFournisseur}". Cette action est irréversible !`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
      confirmButtonColor: '#d33',   // Rouge pour la suppression
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        // Appel au service pour supprimer
        this.loaderService.show();
        this.commandeFournisseurService.supprimer(this.commandeFournisseur.idCommandeFournisseur)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé',
              text: `Le commande fournisseur  "${this.commandeFournisseur.idCommandeFournisseur}" a été supprimé avec succès.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: true
            }).then(() =>{
              this.router.navigate(["achat/commande"])
            });
          },
          error: (erreur) => {
            var message= erreur.error.message? erreur.error.message:'Impossible de supprimer le fournisseur.';
            Swal.fire({
              title: 'Erreur',
              text: message,
              icon: 'error'
            });
          }
        });
      }
    });
  }

  
  // ----------------------- Supprimer  ------------------------
  valider(){
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de valider la commande fournisseur "${this.commandeFournisseur.idCommandeFournisseur}". 
Après cette action, vous ne pourrez plus apporter de modifications, sauf en annulant l’action par un utilisateur disposant de ce droit.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
      confirmButtonColor: '#d33',   // Rouge pour la suppression
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        // Appel au service pour supprimer
        this.loaderService.show();
        this.commandeFournisseurService.valider(this.commandeFournisseur.idCommandeFournisseur)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: (data) => {
            this.commandeFournisseur=data
          },
          error: (erreur) => {
            var message= erreur.error.message? erreur.error.message:'Impossible de supprimer le fournisseur.';
            Swal.fire({
              title: 'Erreur',
              text: message,
              icon: 'error'
            });
          }
        });
      }
    });
  }

  // ----------------------- Sauvegarder detail  ------------------------
  produits:any[]=[];
  check:boolean=false;
  sauvegarder(){
    this.check=true;
    if(this.form.valid){
      var formeValue= this.form.getRawValue();
      var detail={
        idProduit:formeValue.produit.idProduit,
        prix:formeValue.prix,
        idConditionnementProduit:formeValue.produit.idConditionnementProduit,
        quantite:formeValue.quantite,
        idVariante:formeValue.idVariante,
        tva:formeValue.tva
      }
      this.loaderService.show();
      this.commandeFournisseurService.addDetail(this.idcommandeFournisseur,detail)
      .pipe(
        finalize(() => this.loaderService.hide()) // ✅ appelé toujours
      )
      .subscribe({
        next: (response: any) => {
          this.form.patchValue(
            {
              produit: '',
              prix: '',
              quantite: '1',
              idVariante:''
              
            }
          )
          this.detailCommande.push(response)
          this.check=false;
        },
        error: (error: HttpErrorResponse) => {
          var message= error.error.message|| 'Erreur lors de la connexion';
          Swal.fire({
            title: 'Erreur',
            text: message,
            icon: 'error'
          });
        }
      });
    }
  }
  

  getTotal(){
    var formValue= this.form.getRawValue();
    var montantTtc= formValue.prix+(formValue.prix * formValue.tva/100);
    return (montantTtc * formValue.quantite)
  }

  
  getPrixTtc(){
    var formValue= this.form.getRawValue();
    return formValue.prix+(formValue.prix * formValue.tva/100)
  }
  isValide(nom:string){
    var champs=this.form.get(nom)!;
    return (champs.valid && (champs.dirty || champs.touched))!
  }

  getClass(nom:string){
    if(this.check){
      if(this.isValide(nom)){
      return "is-valid";
      }
      else{
        return "is-invalid";
      }
    }
    else{
      return "";
    }
    
  }

  
  getDataProduit(){
    this.loaderService.show();
    this.commandeFournisseurService.getAllProduit(this.idcommandeFournisseur)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.produits=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    }); 
  }

  produitChange(){
    var produit= this.form.getRawValue().produit
    this.form.patchValue({
      prix:produit!.montant,
      idVariante:produit!.idVariante,
      tva:produit!.tva
    })
  }

  getMontantHT(){
    var total = this.detailCommande.reduce((somme, item) => somme + item.montantTotal, 0);
    return total;
  }


  getMontantTVA(){
    var total = this.detailCommande.reduce((somme, item) => somme + item.montantTva, 0);
    return total;
  }


  getMontantTotal(){
    var total = this.detailCommande.reduce((somme, item) => somme + item.montantTtc, 0);
    return total;
  }

  getPoidsTotal(){
    var total = this.detailCommande.reduce((somme, item) => somme + item.poidsTotal, 0);
    return total;
  }

  
  // ----------------------- Sauvegarder detail  ------------------------
  detailModifier:any;
  modifier(detail:any){
    this.editMode=true
    this.detailModifier=Object.assign({}, detail);
    
  }

  isEditRow(id:string){
    if(this.detailModifier && this.detailModifier!.idDetailCommandeFournisseur==id && this.editMode){
      return true;
    }
    return false;
  }
  sauvegarderModification(){

    this.loaderService.show();
      this.commandeFournisseurService.updateDetail(this.idcommandeFournisseur,this.detailModifier.idDetailCommandeFournisseur,this.detailModifier)
      .pipe(
        finalize(() => {
          this.loaderService.hide()
          this.editMode=false
        }) // ✅ appelé toujours
      )
      .subscribe({
        next: (response: any) => {
          this.form.patchValue(
            {
              produit: '',
              prix: '',
              quantite: '1',
              tva: '0'
              
            }
          )
          var index= this.detailCommande.findIndex(x=> x.idDetailCommandeFournisseur==this.detailModifier.idDetailCommandeFournisseur);
          if(index>=0){
            this.detailCommande[index]=Object.assign({}, response);
          }
        },
        error: (error: HttpErrorResponse) => {
          var message= error.error.message|| 'Erreur lors de la connexion';
          Swal.fire({
            title: 'Erreur',
            text: message,
            icon: 'error'
          });
        }
      });
  }
  getTotalModif(){
    var value= this.detailModifier;
    return (value.quantite* value.prixTtc);
  }

  
  annulerModification(){
    this.detailModifier=undefined;
    this.editMode=false;
  }
  // ----------------------- Sauvegarder detail  ------------------------

  retirer(detail:any){
    var id = detail.idDetailCommandeFournisseur
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: `Vous êtes sur le point de supprimer le "${detail.produit}". Cette action est irréversible !`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
        confirmButtonColor: '#d33',   // Rouge pour la suppression
        cancelButtonColor: '#6c757d'
      }).then((result) => {
        if (result.isConfirmed) {
          // Appel au service pour supprimer
          this.loaderService.show();
          this.commandeFournisseurService.retirerDetail(this.idcommandeFournisseur,id)
          .pipe(finalize(() => this.loaderService.hide()))
          .subscribe({
            next: () => {
              let index=this.detailCommande.findIndex( x=> x.idDetailCommandeFournisseur==id)
              if(index>=0){
                this.detailCommande.splice(index,1);
              }
            },
            error: (erreur) => {
              var message= erreur.error.text? erreur.error.text:'Impossible de supprimer le commande fournisseur.';
              Swal.fire({
                title: 'Erreur',
                text: message,
                icon: 'error'
              });
            }
          });
        }
      });
  }

  // ----------------------- Modal entrer en stock  ------------------------

  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  entrerEffectuer(visible : boolean){
    this.getData();
    this.toggleLiveDemo();
  }
}
