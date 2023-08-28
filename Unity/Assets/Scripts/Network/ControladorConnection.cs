using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class ControladorConnection : MonoBehaviour

{
    [SerializeField] private GameObject test;
    [SerializeField] private GameObject loadTest;
    [SerializeField] private GameObject connection;
    [SerializeField] private TMP_Text textError;

    private bool sceneState;
    private bool state = true;

    private void Update()
    {
        if (!state)
        {
        // Detener el Update
            return;
        }
        else
        {
            CheckConnection();
        }
    }

    //Funcion para detectar si el dispositivo cuenta con conexion a internet
    private void CheckConnection()
    {
        bool isConnected = Application.internetReachability != NetworkReachability.NotReachable;
        sceneState = false;

        if (!isConnected)
        {
            if (loadTest.activeSelf)
            {
                loadTest.SetActive(false);
                sceneState = true;
            }
            else
            {
                test.SetActive(false);
                sceneState = false;
            }
            connection.SetActive(true);
            state = false;
        }        
    }

    //Funcion para restablecer la conexion de internet
    public void ResetConexion()
    {
        textError.text = "Verificando Conexion de Internet...";
        Debug.Log("Verificando CONEXION");
        bool isConnected = Application.internetReachability != NetworkReachability.NotReachable;
        if (!isConnected)
        {
            textError.text = "Error \n Vuelva a Intentarlo...";
        }
        else
        {
            StartCoroutine(ContinueScene()); 
        }
    }

    //Funcion continuar a la ultima escena cargada del test
    private IEnumerator ContinueScene()
    {
        textError.text = "Conexión Restablecida";
        yield return new WaitForSeconds(3);

        if (sceneState == true)
        {
            loadTest.SetActive(true);
        }
        else
        {
            test.SetActive(true);
        }
        connection.SetActive(false);
        state = true;
        textError.text = "Error de Conexión \n - \n Revise su Conexión de Internet";
    }

}
