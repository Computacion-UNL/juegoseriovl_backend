using System.Collections;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;


public class LoginManager : MonoBehaviour
{
    [Header("Login")]
    [SerializeField] private TMP_InputField userInput;
    [SerializeField] private TMP_Text textError;
    private string estudent;
    private int test;
    
    
    private NetworkManager networkManager = null;

    private void Awake()
    {
        networkManager = GameObject.FindObjectOfType<NetworkManager> ();
    }

    private void Start()
    {
        userInput.text = "";
    }

    //Funcion para realizar las validaciones e ingreso en la seccion login
    public void SubmitLogin()
    {
        if (userInput == null || textError == null)
        {
            Debug.LogError("Los componentes no están asignados en el Inspector.");
            return;
        }

        string inputText = userInput.text;

        if (string.IsNullOrWhiteSpace(inputText))
        {
            textError.text = "Por favor ingrese el código";
            return;
        } 
        else if (inputText.Length >= 7)
        {
            textError.text = "El código debe ser de 6 dígitos";
            return;
        }
        else
        {
            textError.text = "Procesando...";

            networkManager.CheckUser(userInput.text, (response) =>
            {
                if (response.message.Contains("failed"))
                {
                    userInput.text = "";
                    textError.text = "Error de Conexión - Revise su Conexión a Internet";
                }
                else
                {   
                    if (response.message.Contains("ok"))
                    {
                        StartCoroutine(UploadTest(() =>
                        {
                            if(test == 1)
                            {
                                StartCoroutine(UploadData());
                            }
                            else
                            {
                                userInput.text = "";
                                textError.text = "Error al cargar el Test";
                                Debug.Log("No se cargaron las imagenes del Test");
                            }
                        }));                        
                    }
                    else
                    {
                        textError.text = "Estudiante No Encontrado";
                        userInput.text = "";
                        Debug.Log("No se encontró al estudiante");
                    }
                }
            });
        }
    }

    //Funcion para guardar el id del estudiante y cargar la siguiente escena (test y cuentos)
    private IEnumerator UploadData()
    {
        textError.text = "Estudiante Encontrado";
        estudent = PlayerPrefs.GetString("estudiante");
        Debug.Log("ESTUDIANTE!!!>" + estudent);
        yield return new WaitForSeconds(2);
        textError.text = "Bienvenido";
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
    }

    //Funcion para detectar si existe la cantidad de imagenes necesarias para el test
    private IEnumerator UploadTest(Action onComplete)
    {
        textError.text = "Cargando test...";
        networkManager.CheckTest();
        yield return new WaitForSeconds(2);
        test = PlayerPrefs.GetInt("test");
        Debug.Log("Terminando de Cargar test...");
        Debug.Log("TEST VALOR" + test);
        textError.text = "Test Cargado";
        
        onComplete?.Invoke();
    }
}

