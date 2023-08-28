using System.Collections;
using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class ControladorBarra : MonoBehaviour
{
    //Variables para la barra de carga de las escenas del test
    public TextMeshProUGUI textProgess;
    public Slider sliderProgress;
    public float currentPercent;
    public TMP_Text textMessage;
    private AsyncOperation loadAsync;
    [SerializeField] private GameObject continueSection;
    [SerializeField] private GameObject closeSection;
    private bool stopUpdate = true;

    private float numCount  = 0;

    void Start()
    {
        textMessage.text = PlayerPrefs.GetString("MensajeEscena");
        StartCoroutine(LoadScene());
        continueSection.SetActive(false);
        sliderProgress.interactable = false;
    }

    //Funcion para cerrar y abrir una escena
    public void OnButtonClick(GameObject loadScene)
    {
        closeSection.SetActive(false);
        loadScene.SetActive(true);
    }

    //Funcion para la barra de carga de las escenas del test
    private IEnumerator LoadScene()
    {
        textProgess.text = "Cargando... 00%";

        while(numCount  <= 100)
        {
            currentPercent = numCount +1 * 100 /0.9f;
            textProgess.text = "Cargando... " + sliderProgress.value.ToString("00")+"%";
            yield return null;
        }
    }

    private void Update()
    {
        if (stopUpdate)
        {
            sliderProgress.value = Mathf.MoveTowards(sliderProgress.value, currentPercent, 10 * Time.deltaTime);

            if( currentPercent >= 100 && sliderProgress.value == 100)
            {
                stopUpdate = false;
                continueSection.SetActive(true);
            }
        }    
    }
}
