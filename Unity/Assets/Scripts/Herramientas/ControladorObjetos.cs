using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ControladorObjetos : MonoBehaviour
{
    //Funcion para destruir un objeto de la escena
    public void DestroyObject(string objectName)
    {
        GameObject objectToDestroy = GameObject.Find(objectName); // Reemplaza "NombreDelObjeto" con el nombre del objeto que deseas destruir

        if (objectToDestroy != null)
        {
            Destroy(objectToDestroy);
        }
    }
}
