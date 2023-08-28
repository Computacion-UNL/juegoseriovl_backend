using UnityEngine;

public class ControladorAudio : MonoBehaviour
{
    private float value;

    void Awake()
    {      
        AudioVolume();   
    }

    //Funcion para obtener el valor del audio de la configuracion en la seccion opciones - audio
    public void AudioVolume()
    {      
        value = PlayerPrefs.GetFloat("volumenAudio");
        AudioListener.volume = value;    
    }

}
