using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;


public class MenuOpciones : MonoBehaviour
{

    [SerializeField] private Slider sliderAudio;
    [SerializeField] private Image imagenMute;
    private float audioVolume = 0.5f;

    private void Start()
    {
        sliderAudio.value = PlayerPrefs.GetFloat("volumenAudio", audioVolume);
        SetAudioVolume(sliderAudio.value);
        CheckMute();
    }

    //Funcion para guardar los cambios del volumen del audio general del juego
    public void ChangeSliderAudio(float value)
    {
        SetAudioVolume(value);
        CheckMute();
    }

    //Funcion para modificar los valores del volumen del audio general del juego
    private void SetAudioVolume(float value)
    {
        audioVolume = value;
        AudioListener.volume = audioVolume;
        PlayerPrefs.SetFloat("volumenAudio", audioVolume);
        PlayerPrefs.Save();
    }

    //Funcion que permite detectar si el volumen del audio general es 0
    private void CheckMute()
    {
        imagenMute.enabled = Mathf.Approximately(audioVolume, 0f);
    }

    //Funcion para cerrar la aplicación
    public void OnApplicationQuit(){

        Debug.Log("Salir...");
        Application.Quit();
    }
}
