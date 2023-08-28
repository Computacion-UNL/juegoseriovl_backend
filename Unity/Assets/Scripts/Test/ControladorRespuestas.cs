using System;
using System.Text.RegularExpressions;
using UnityEngine;


public class ControladorRespuestas : MonoBehaviour
{
    [SerializeField] private GameObject continueSection;

    void Start()
    {
        continueSection.SetActive(false);
    }

    //Funcion para guardar la respuesta seleccionada por el jugador en los botones con imagenes del test
    public void OnButtonClick(int buttonValue)
    {
        string responseKey = "respuesta" + Mathf.CeilToInt(buttonValue / 3.0f);
        if (GuardarSeleccion(responseKey, buttonValue))
        {
            Debug.Log("Button is selected " + buttonValue);
            continueSection.SetActive(true);
        }
        else
        {
            Debug.Log("No existe el valor seleccionado");
        }
    }

    //Funcion que guarda los datos de las selecciones, imagen y valor
    private bool GuardarSeleccion(string name, int id_image)
    {
        string url = PlayerPrefs.GetString("link" + id_image);
        int value = PlayerPrefs.GetInt("valorImagen" + id_image);

        if (string.IsNullOrEmpty(url))
        {
            return false;
        }
        PlayerPrefs.SetString("seleccion" + name, url);
        PlayerPrefs.SetInt("valor" + name, value);
        PlayerPrefs.Save();

        return true;
    }
}
