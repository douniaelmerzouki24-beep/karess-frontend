import { Component } from '@angular/core';
import { BonLivraisonService } from '../../services/bon-livraison.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bon-livraison',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './bon-livraison.html',
  styleUrls: ['./bon-livraison.css']
})
export class BonLivraisonComponent {
  blData: any = {
    numeroBL: '',
    clientNom: '',
    destinataire: '',
    objet: '',
    totalHt: 0,
    items: [
      { designation: '', unite: '', quantite: 1, prixUnitaire: 0, montantHt: 0 }
    ]
  };
  
  selectedFile: File | null = null;

  constructor(private blService: BonLivraisonService) {}

  ajouterLigne() {
    this.blData.items.push({ designation: '', unite: '', quantite: 1, prixUnitaire: 0, montantHt: 0 });
  }

  // Calcul automatique des totaux
  calculerTotaux() {
    this.blData.totalHt = 0;
    this.blData.items.forEach((item: any) => {
      item.montantHt = item.quantite * item.prixUnitaire;
      this.blData.totalHt += item.montantHt;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
  this.calculerTotaux();
  const formData = new FormData();
  formData.append('bl', JSON.stringify(this.blData));
  
  if (this.selectedFile) {
    formData.append('cachetFile', this.selectedFile);
  }

  this.blService.saveBL(formData).subscribe({
    next: (res) => {
      // res contient l'objet enregistré avec son nouvel ID
      alert('Bon de Livraison enregistré avec succès !');
      
      // APEL POUR OUVRIR LE PDF AUTOMATIQUEMENT
      if (res && res.id) {
        this.ouvrirPdf(res.id);
      }
    },
    error: (err) => alert('Erreur lors de l\'enregistrement')
  });
}

ouvrirPdf(id: number) {
  // Ouvre le PDF dans un nouvel onglet du navigateur
  window.open(`http://localhost:8080/api/bl/pdf/${id}`, '_blank');
}
}