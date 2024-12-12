import { inject, Injectable } from '@angular/core';
import { Firestore, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);

  constructor() {
    console.log('FirestoreService constructor');
  }

  // FUNCIONES NUEVAS POR ID****
  async getDocument(nombreColeccion: string, id: string): Promise<any> {
    const referenciaDocumento = doc(this.firestore, `${nombreColeccion}/${id}`);
    const documento = await getDoc(referenciaDocumento);

    if (documento.exists()) {
      return { id: documento.id, ...documento.data() }; // Incluye el ID del documento
    } else {
      console.warn(
        `No se encontró ningún documento con ID: ${id} en la colección ${nombreColeccion}`
      );
      return null;
    }
  }

  //********************************************************************************************* */

  // Método para crear un documento en una colección
  async createDocument(collectionName: string, data: any): Promise<string> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = await addDoc(collectionRef, data); // Crea el documento
    console.log('Documento creado con ID:', docRef.id); // Muestra el ID generado
    return docRef.id; // Devuelve el ID generado
  }

  // Método para obtener el primer documento que coincida con la consulta
  async getDocumentsByQuery(
    collectionName: string,
    field: string,
    value: any
  ): Promise<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const queryFilter = query(collectionRef, where(field, '==', value));
    const querySnapshot = await getDocs(queryFilter);

    // Asegúrate de incluir el ID de Firestore en los datos retornados
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Método para actualizar el estado del viaje basado en su ID
  async actualizarEstadoViaje(
    viajeId: string,
    nuevoEstado: string
  ): Promise<void> {
    const viajeRef = doc(this.firestore, `viajes/${viajeId}`); // Referencia al documento por ID
    await updateDoc(viajeRef, { estado: nuevoEstado }); // Actualiza el estado
    console.log(
      `Estado del viaje con ID ${viajeId} actualizado a ${nuevoEstado}`
    );
  }

  async getViajeActual(viajeId: string): Promise<any> {
    const viaje = await this.getDocument('viajes', viajeId);
    console.log('Viaje obtenido de Firestore:', viaje);
    return viaje;
  }

  async getViajesAceptados(idUsuario: string): Promise<any[]> {
    const collectionRef = collection(this.firestore, 'viajes');
    const filtroConsulta = query(
      collectionRef,
      where('usuarioId', '==', idUsuario), // Filtrar por ID del usuario
      where('estado', '==', 'aceptado') // Filtrar por estado "aceptado"
    );

    const querySnapshot = await getDocs(filtroConsulta);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async getViajesPendientes(): Promise<any[]> {
    return this.getDocumentsByQuery('viajes', 'estado', 'pendiente');
  }

  async eliminarViaje(viajeId: string): Promise<void> {
    console.log('Intentando eliminar el viaje con ID:', viajeId);

    if (!viajeId) {
      console.error('ID del viaje no es válido. No se puede eliminar.');
      return;
    }

    try {
      const referenciaDocumento = doc(this.firestore, `viajes/${viajeId}`);
      console.log('Referencia del documento:', referenciaDocumento);

      await deleteDoc(referenciaDocumento);
      console.log(
        `Viaje con ID ${viajeId} eliminado correctamente de Firestore.`
      );
    } catch (error) {
      console.error(`Error al eliminar el viaje con ID ${viajeId}:`, error);
      throw error; // Esto se manejará en el método que llama a eliminarViaje
    }
  }

  async verificarViajeActivo(correoConductor: string): Promise<boolean> {
    // Obtener viajes con conductorCorreo coincidente y estado "pendiente"
    const viajes = await this.getDocumentsByQuery(
      'viajes',
      'conductorCorreo',
      correoConductor
    );

    // Devolver true si existe algún viaje en estado "pendiente"
    return viajes.some(
      (viaje) => viaje.estado === 'pendiente' || viaje.estado === 'aceptado'
    );
  }
}
