using UnityEngine;
using UnityEngine.SceneManagement;

public class ControladorEscenas : MonoBehaviour
{   
    //Funcion que envia un mensaje para las siguientes escenas
    public void MessageScene(string messageScene)
    {
        PlayerPrefs.SetString("MensajeEscena", messageScene);
    }

    //Funcion para abrir una escena
    public void OpenScene(string nameScene)
    {
        SceneManager.LoadScene(nameScene);
    }

    //Función para abrir una escena mediante un boton
    public void OnButtonClick(GameObject loadScene)
    {
        loadScene.SetActive(true);
    }

}
