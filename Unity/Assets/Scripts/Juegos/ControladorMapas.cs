using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;

public class ControladorMapas : MonoBehaviour
{
    static ControladorMapas current;

    [SerializeField] private TMP_Text itemsCounter;
    [SerializeField] private TMP_Text starsCounter;
    [SerializeField] private TMP_Text finalMessage;

    [SerializeField] private ControladorEscenas controllerScene;
    [SerializeField] private string nextSceneMessage;
    [SerializeField] private string nextSceneName;
    [SerializeField] private string gameNumber;

    private int items;
    private int stars;

    //Funcion donde se van sumando los items recolectados en el juego d eplataformas
    public static void ItemSum()
    {
        current.items++;
        UpdateText(current.itemsCounter, current.items);
    }

    //Funcion donde se van sumando las estrellas recolectados en el juego d eplataformas
    public static void StarSum()
    {
        current.stars++;
        UpdateText(current.starsCounter, current.stars);
    }

    //Funcion donde se van editando la puntuacion en tiempo real del juego de plataformas
    private static void UpdateText(TMP_Text textComponent, int value)
    {
        textComponent.text = value < 10 ? "0" + value.ToString() : value.ToString();
    }

    //Funcion para presentar un mensaje al final del juego de plataformas
    public void FinalGameMessage()
    {
        current.finalMessage.text = "Fin del Juego ";
    }

    //Funcion para guardar la puntuacion obtenida dentro el juego de plataformas
    public void SaveData()
    {
        string nombreItems = "items" + gameNumber;
        string nombreEstrellas = "estrellas" + gameNumber;
        PlayerPrefs.SetInt(nombreItems, items);
        PlayerPrefs.SetInt(nombreEstrellas, stars);
    }

    //Funcion para detectar si el jugador llego al final del juego
    private void OnTriggerEnter2D(Collider2D collider)
    {
        if (collider.CompareTag("Jugador"))
        {
            FinalGameMessage();
            SaveData();
            StartCoroutine(SceneChange());
        }
    }

    //Funcion para cambiar de escena al finalizar el juego de plataformas
    private IEnumerator SceneChange()
    {
        controllerScene.MessageScene(nextSceneMessage);
        yield return new WaitForSeconds(3);
        controllerScene.OpenScene(nextSceneName);
    }

    //Funcion que elimina el objeto de controlador de mapas al finalizar el juego de plataformas
    private void Awake()
    {
        if(current != null && current != this)
        {
            Destroy(gameObject);
            return;
        }
        current = this;
    }
}
