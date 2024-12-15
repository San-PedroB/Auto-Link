import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-resumen-viaje',
  templateUrl: './resumen-viaje.page.html',
  styleUrls: ['./resumen-viaje.page.scss'],
})
export class ResumenViajePage implements OnInit {
  viajeResumen: any = null; // Datos del viaje

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit() {
    const viajeId = this.route.snapshot.paramMap.get('id'); // Obtener el ID del viaje desde la URL
    if (viajeId) {
      this.cargarResumenViaje(viajeId);
    } else {
      console.error('No se proporcionó el ID del viaje.');
      this.router.navigate(['/listado-de-viajes']); // Redirigir si no hay ID
    }
  }

  async cargarResumenViaje(viajeId: string) {
    try {
      const datosViaje = await this.firestoreService.getViajeActual(viajeId);
      if (datosViaje) {
        let conductorNombre = 'Desconocido';
        let conductorApellido = '';

        // Obtener datos del conductor si existe el correo
        if (datosViaje.conductorCorreo) {
          const datosConductor =
            await this.firestoreService.obtenerDatosConductor(
              datosViaje.conductorCorreo
            );
          if (datosConductor) {
            conductorNombre = datosConductor.nombre || 'Desconocido';
            conductorApellido = datosConductor.apellido || '';
          }
        }

        // Asignar los datos al objeto viajeResumen
        this.viajeResumen = {
          origen: datosViaje.origen,
          destino: datosViaje.destino,
          conductorNombre,
          conductorApellido,
          precio: datosViaje.precio,
          estado: datosViaje.estado,
        };
      } else {
        console.warn('No se encontraron datos del viaje.');
      }
    } catch (error) {
      console.error('Error al cargar el resumen del viaje:', error);
    }
  }
}
