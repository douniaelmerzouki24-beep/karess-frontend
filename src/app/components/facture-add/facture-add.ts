import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-facture-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facture-add.html',
  styleUrl: './facture-add.css'
})
export class FactureAddComponent {
 facture: any = {
    // On utilise le numéro de BC ou un ID généré pour remplir le champ obligatoire
    numeroFacture: 'BL-' + Math.floor(Math.random() * 9000 + 1000),
    clientNom: '',
    clientAdresse: '',
    clientIce: '',      // Initialisé
    bcNumero: '',       // Initialisé
    objetFacture: '',   // Initialisé
    dateFacture: new Date().toISOString().split('T')[0],
    totalHt: 0,
    tvaRate: 20.0,      // Correspond au nouveau nom Java
    totalTva: 0,
    totalTtc: 0,
    items: [{ designation: '', unite: '', quantite: 1, prixUnitaire: 0, montantHt: 0 }]
};

  constructor(private http: HttpClient) {}

  ajouterLigne() {
    this.facture.items.push({ designation: '', unite: '', quantite: 1, prixUnitaire: 0 });
  }

  supprimerLigne(index: number) {
    this.facture.items.splice(index, 1);
  }
  calculerTotaux() {
  // On précise que acc est un 'number' et item est de type 'any' (ou ton interface FactureItem)
  this.facture.totalHt = this.facture.items.reduce((acc: number, item: any) => {
    return acc + (item.prixUnitaire * item.quantite);
  }, 0); // Le '0' à la fin est très important pour initialiser l'accumulateur

  // Calcul dynamique selon le taux choisi
  this.facture.totalTva = this.facture.totalHt * (this.facture.tvaRate / 100);
  this.facture.totalTtc = this.facture.totalHt + this.facture.totalTva;
}

  enregistrer() {
    this.http.post('http://localhost:8080/api/factures/save', this.facture)
      .subscribe({
        next: (res: any) => {
          alert('Facture enregistrée !');
          window.open(`http://localhost:8080/api/factures/generate-pdf/${res.id}`, '_blank');
        },
        error: (err) => alert('Erreur : Vérifie que ton Backend Java est allumé !')
      });
  }
}