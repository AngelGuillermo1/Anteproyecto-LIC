
//importando metodos de firebase.js
import { saveProduct, getProducts, getProductListSize, 
    deleteProduct, getProduct, updateProduct } from "./firebase.js";

//declarando variables
const btnAgregar = document.getElementById("idBtnAgregar");
const btnActualizar = document.getElementById("idBtnActualizar");
const btnBuscar = document.getElementById("idBtnBuscar");
const InputBuscar = document.getElementById("idInputBuscar");
const TxtNombre = document.getElementById("idTxtNombre");
const NumEdad = document.getElementById("idNumEdad");
const NumAltura = document.getElementById("idNumAltura");
const InputSexo = document.getElementById("idInputSexo");
const NumPeso = document.getElementById("idNumPeso");
const TxtPais = document.getElementById("idTxtPais");
const tablaJugadores = document.getElementById("idTablaJugadores");
//creando un arreglo
let arrayJugadores_nuevos = [];
//funcion para limpiar campos
const Limpiar = () => {
    TxtNombre.value = "";
    NumEdad.value = "";
    NumAltura.value = "";
    InputSexo.value = 0;
    NumPeso.value = "";
    TxtPais.value = "";
    TxtNombre.focus();
}
//comprobar datos datos
const comprobar = function() {
    let nombre = TxtNombre.value;
    let edad = NumEdad.value;
    let altura = NumAltura.value;
    let sexo = InputSexo.value;
    let peso = NumPeso.value;
    let pais = TxtPais.value;
     if(nombre == ""){
        alertify.warning('Debe ingresar un nombre.');
        return false;
     } else if(parseFloat(edad)<=0 || isNaN(parseFloat(edad))){
        alertify.warning('Debe ingresar una edad valida.');
        return false;
     } else if(parseFloat(altura)<=0 || isNaN(parseFloat(altura))){
        alertify.warning('Debe ingresar una altura valida.');
        return false;
     } else if(sexo == 0){
        alertify.warning('Debe seleccionar un sexo.');
        return false;
     } else if(peso == "" && peso < 0){
        alertify.warning('Debe ingresar una altura válida.');
        return false;
     } else if(pais == ""){
        alertify.warning('Debe ingresar un país válido.');
        return false;
     } else {
        return true;
     }
}

async function Añadir(){
    if(comprobar()){
        let nombre = TxtNombre.value;
        let edad = NumEdad.value;
        let altura = NumAltura.value;
        let sexo = InputSexo.options[InputSexo.selectedIndex].text;
        let peso = NumPeso.value;
        let pais = TxtPais.value;
        saveProduct({nombre, edad, altura, sexo, peso, pais});
        Limpiar();
        alertify.success('Jugador agregado exitosamente.');
    }
}
//agregar fila a la tabla
async function imprimirFilas(){
    let fila = "";
    let count = 20;
    let size = await getProductListSize();
    if (size == 0){
        alertify.error('No se ha agregado ningun jugador nuevo');
    }else{
        const ListaJugadores = await getProducts();
        ListaJugadores.forEach(element =>{
            const Jugador = element.data();
            fila += `
                        <tr>
                            <td scope="row" class="text-center fw-bold">${count}</td>
                            <td>${Jugador.nombre}</td>
                            <td>${Jugador.edad} años</td>
                            <td>${Jugador.altura} metros</td>
                            <td>${Jugador.sexo}</td>
                            <td>${Jugador.peso} libras</td>
                            <td>${Jugador.pais}</td>
                            <td><button id="${element.id}" type="button" class="btn btn-danger bi bi-trash3-fill btnEliminar-Fila" alt="Eliminar"></button>
                            <button id="${element.id}" type="button" class="btn btn-primary bi bi-pencil-square btnEditar-Fila" alt="Editar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
    `;
        });
        count++;
        
    }
    
    const btnEliminar = document.getElementById("idTableBody").querySelectorAll(".btnEliminar-Fila");
    btnEliminar.forEach(btn =>{
        btn.addEventListener('click',(event)=>{
            alertify.confirm("¿Está seguro de eliminar los datos?",
            function(){
                deleteProduct(event.target.dataset.id);
                alertify.success("Jugador eliminado de base de datos");
                imprimirFilas();
            }, function(){
                alertify.error("Solicitud cancelada")
            }
            );
        })
    })

    const btnEditar = document.getElementById("idTableBody").querySelectorAll(".btnEditar-Fila");
    btnEditar.forEach(btn=>{
        btn.addEventListener('click', async(event)=>{
            let jugador = await getProduct(event.target.dataset.id);
            let id = jugador.id;
            jugador = jugador.data();
            document.getElementById("idEditar").value = id;
            document.getElementById("idTxtEditarNombre").value = jugador.nombre;
            document.getElementById("idNumEditarEdad").value = jugador.edad;
            document.getElementById("idNumEditarAltura").value = jugador.altura;
            document.getElementById("idNumEditarPeso").value = jugador.peso;
            document.getElementById("idTxtEditarPais").value = jugador.pais;

            let Sexo = document.getElementById("idInputEditarSexo");
            Sexo.options[Sexo.selectedIndex].text = jugador.sexo;
        })
    })

}

async function MostrarJugadores(){
    let table = `
    <div class="table-responsive">
                    <table class="table table-striped border-success table-hover table-bordered" id="table">
                        <thead>
                            <tr>
                                <th scope="col" class="text-center" style="width:5%">#</th> 
                                <th scope="col" class="text-center" style="width:15%">Nombre</th>
                                <th scope="col" class="text-center" style="width:15%">Edad</th>
                                <th scope="col" class="text-center" style="width:10%">altura</th> 
                                <th scope="col" class="text-center" style="width:10%">Sexo</th> 
                                <th scope="col" class="text-center" style="width:10%">peso</th> 
                                <th scope="col" class="text-center" style="width:25%">pais</th> 
                                <th scope="col" class="text-center" style="width:10%">Opciones</th> 
                            </tr>
                        </thead>
                        <tbody id="idTableBody">
                        <tr>
                            <td scope="row" class="text-center fw-bold">1</td>
                            <td>Dalano Banton</td>
                            <td>24 años</td>
                            <td>2.01 metros</td>
                            <td>Hombre</td>
                            <td>204 libras</td>
                            <td>Canadá</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">2</td>
                            <td>Oshae Brissett</td>
                            <td>25 años</td>
                            <td>2.01 metros</td>
                            <td>Hombre</td>
                            <td>210 libras</td>
                            <td>Canadá</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">3</td>
                            <td>Malcolm Brogdon</td>
                            <td>31 años</td>
                            <td>1.93 metros</td>
                            <td>Hombre</td>
                            <td>229 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">4</td>
                            <td>Jaylen Brown</td>
                            <td>27 años</td>
                            <td>1.98 metros</td>
                            <td>Hombre</td>
                            <td>223 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">5</td>
                            <td>JD Davison</td>
                            <td>21 años</td>
                            <td>1.85 metros</td>
                            <td>Hombre</td>
                            <td>195 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">6</td>
                            <td>Blake Griffin</td>
                            <td>34 años</td>
                            <td>2.06 metros</td>
                            <td>Hombre</td>
                            <td>250 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">7</td>
                            <td>Sam Hausser</td>
                            <td>26 años</td>
                            <td>2.01 metros</td>
                            <td>Hombre</td>
                            <td>217 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">8</td>
                            <td>Al Horford</td>
                            <td>37 años</td>
                            <td>2.06 metros</td>
                            <td>Hombre</td>
                            <td>240 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">9</td>
                            <td>Mfiondu Kabengele</td>
                            <td>26 años</td>
                            <td>2.06 metros</td>
                            <td>Hombre</td>
                            <td>250 libras</td>
                            <td>Canadá</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">10</td>
                            <td>Luke Kornet</td>
                            <td>28 años</td>
                            <td>2.18 metros</td>
                            <td>Hombre</td>
                            <td>250 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">11</td>
                            <td>Svi Mykhailiuk</td>
                            <td>26 años</td>
                            <td>2.01 metros</td>
                            <td>Hombre</td>
                            <td>205 libras</td>
                            <td>Ucrania</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">12</td>
                            <td>Kistaps Porzingis</td>
                            <td>28 años</td>
                            <td>2.21 metros</td>
                            <td>Hombre</td>
                            <td>240 libras</td>
                            <td>Letonia</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">13</td>
                            <td>Payton Pritchard</td>
                            <td>25 años</td>
                            <td>1.85 metros</td>
                            <td>Hombre</td>
                            <td>195 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">14</td>
                            <td>Payton Pritchard</td>
                            <td>25 años</td>
                            <td>1.85 metros</td>
                            <td>Hombre</td>
                            <td>195 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">15</td>
                            <td>Jay Scrubb</td>
                            <td>23 años</td>
                            <td>1.96 metros</td>
                            <td>Hombre</td>
                            <td>220 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">16</td>
                            <td>Jayson Tatum</td>
                            <td>25 años</td>
                            <td>2.03 metros</td>
                            <td>Hombre</td>
                            <td>210 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">17</td>
                            <td>Derrick White</td>
                            <td>29 años</td>
                            <td>1.85 metros</td>
                            <td>Hombre</td>
                            <td>190 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">18</td>
                            <td>Derrick White</td>
                            <td>29 años</td>
                            <td>1.85 metros</td>
                            <td>Hombre</td>
                            <td>190 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" class="text-center fw-bold">19</td>
                            <td>Robert Williams III</td>
                            <td>26 años</td>
                            <td>2.06 metros</td>
                            <td>Hombre</td>
                            <td>237 libras</td>
                            <td>Estados Unidos</td>
                            <td>
                            <button type="button" class="btn btn-danger bi bi-trash3-fill btnEliminarFila" alt="Editar"></button>
                            <button type="button" class="btn btn-primary bi bi-pencil-square btnEditarFila" alt="Eliminar" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
                            </td>
                        </tr>
                            ${await imprimirFilas()}
                        </tbody>
                    </table>
                </div>
    `;
    tablaJugadores.innerHTML = table;
}


document.querySelector("#btnEditarFila").onclick = function(){
    const id = document.getElementById("idEditar").value;
    const nombre = document.getElementById("idTxtEditarNombre").value
    const edad = document.getElementById("idNumEditarEdad").value
    const altura = document.getElementById("idNumEditarAltura").value
    const peso = document.getElementById("idNumEditarPeso").value
    const pais = document.getElementById("idTxtEditarPais").value
    const sltsexo = document.getElementById("idInputEditarSexo");
    const sexo = sltsexo.options[sltsexo.selectedIndex].text;
    updateProduct(id,{nombre, edad,altura,peso, pais,sexo});
    alertify.success("Datos del jugador actualizados");
    imprimirFilas();

}

tablaJugadores.addEventListener("click", Eliminar);
function Eliminar(fila){
    const tabla = document.querySelector("#table");
    console.log(fila.target);
    if(fila.target.matches(".btnEliminarFila")){
        console.log("Eliminar Fila");
        console.log(fila.target.parentNode.parentNode.rowIndex);
        const tIndex = fila.target.parentNode.parentNode.rowIndex;
        tabla.deleteRow(tIndex);
        Conteo();
    }
}

function Conteo(){
    const tabla = document.querySelector("#idTableBody");
    const ConteoFilas = tabla.rows.length;
    const countJugadores = document.getElementById("idCountJugadores");
    if (ConteoFilas == 0){
        countJugadores.textContent = "jugadores Agregados: " + ConteoFilas;
        countJugadores.style.color = "red";
    } else {
        countJugadores.style.color = "green";
        countJugadores.textContent = "jugadores Agregados: " + ConteoFilas; 
    }

}

async function Buscar(){
    let buscar = InputBuscar.value.toString().toLowerCase();
    const tabla = document.querySelector("#table");
    let filas =document.getElementsByTagName("tr");
    for(let i = 0; i < filas.length; i++){
        let nombreJugador = filas[i].cells[1].textContent.toString().toLowerCase();
        if(nombreJugador.indexOf(buscar) === -1){
            filas[i].style.visibility = "collapse"; 
        } else {
            filas[i].style.visibility = "";
        }
    }
    return InputBuscar.value = "";
}

btnBuscar.onclick = () => {Buscar();};
btnAgregar.onclick = () => {Añadir();};
btnActualizar.onclick = () => {MostrarJugadores();};
