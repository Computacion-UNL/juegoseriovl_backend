using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Newtonsoft.Json;


public class ControladorPuntuaciones : MonoBehaviour
{
    // [SerializeField] private TMP_Text cherryScore;
    // [SerializeField] private TMP_Text starScore1;
    [SerializeField] private TMP_Text diamondScore1;
    [SerializeField] private TMP_Text starScore2;
    [SerializeField] private TMP_Text textError;
    // [SerializeField] private TMP_Text score_diamante2 = null;
    // [SerializeField] private TMP_Text score_estrella3 = null;
    [SerializeField] private GameObject continueSection;
    [SerializeField] private GameObject reload;

    private NetworkManager networkManager = null;

    // private int sumCherries;
    // private int sumStar1;
    private int sumDiamond1;
    private int sumStar2;
    // private int totalDiamantes2;
    // private int totalEstrellas3;

    //Funcion que obtiene los datos de los items y estrellas reolectados en los juegos de plataformas
    private void Awake()
    {
        // sumCherries = PlayerPrefs.GetInt("items1");
        // Debug.Log(sumCherries);
        // sumStar1 = PlayerPrefs.GetInt("estrellas1");
        // Debug.Log(sumStar1);
        sumDiamond1 = PlayerPrefs.GetInt("items2");
        // Debug.Log(sumDiamond1);
        sumStar2 = PlayerPrefs.GetInt("estrellas2");
        // Debug.Log(sumStar2);
        // totalDiamantes2 = PlayerPrefs.GetInt("items3");
        // Debug.Log(totalDiamantes2);
        // totalEstrellas3 = PlayerPrefs.GetInt("estrellas3");
        // Debug.Log(totalEstrellas3);
        networkManager = GameObject.FindObjectOfType<NetworkManager> ();
    }

    //Funcion para enviar las respuestas del test y mostrar los resultados de las puntuaciones de los juegos
    // de plataformas
    private void Start()
    {
        // SaveData();
        continueSection.SetActive(false);
        reload.SetActive(false);
        StartCoroutine("SendAnswers");
        ShowScores();

    }

    //Funcion para guardar y enviar las respuestas a la plataforma de administracion
    public void SaveData()
    {
        textError.text = "Procesando Respuestas...";

        string estudent = PlayerPrefs.GetString("estudiante");

        List<string> results = new List<string>();
        List<int> valuesResults = new List<int>();

        Debug.Log("SELECCION RESPUESTAS FINALES");
        for (int i = 2; i <= 6; i++)
        {
            results.Add(PlayerPrefs.GetString("seleccionrespuesta" + i.ToString()));
            // Debug.Log("RESPUESTA");
            // Debug.Log(PlayerPrefs.GetString("seleccionrespuesta" + i.ToString()));
            valuesResults.Add(PlayerPrefs.GetInt("valorrespuesta" + i.ToString()));
            // Debug.Log("VALOR RESPUESTA");
            // Debug.Log(PlayerPrefs.GetInt("valorrespuesta" + i.ToString()));
        }

        Debug.Log("Datos de la lista de resultados: " + string.Join(", ", results));
        Debug.Log("Datos de la lista de valores de resultados: " + string.Join(", ", valuesResults));
        Debug.Log("Estudiante: " + estudent);


        int numberResponses = results.Count;

        if(numberResponses < 5 || numberResponses > 5)
        {
            textError.text = "Cantidad de Respuestas Incorrectas";
        }
        else
        {
            StudentAnswers studentAnswers = new StudentAnswers(estudent, results, valuesResults);

            string responses = JsonConvert.SerializeObject(studentAnswers);

            // Debug.Log(responses);

            networkManager.SendTest(responses, delegate (Response response)
            {
                if (response.message.Contains("failed"))
                {
                    textError.text = "Error de Conexión - Revise su Conexión a Internet";
                    reload.SetActive(true);
                }
                else
                {
                    if (response.message.Contains("ok"))
                    {
                        // StartCoroutine("SendAnswers");
                        textError.text = "Juego Guardado Exitosamente";
                        reload.SetActive(false);
                    }
                    else
                    {
                        textError.text = "El Juego Ya Existe";
                        reload.SetActive(false);
                    }
                    continueSection.SetActive(true);
                }
            });
        }
    }

    //Funcion para ejecutar el guardado y envio de respuestas
    private IEnumerator SendAnswers()
    {
        textError.text = "Guardando Puntuaciones...";
        yield return new WaitForSeconds(1);
        SaveData();
    }

    //Funcion para mostrar la puntuación final de los juegos de plataformas
    private void ShowScores()
    {

        // cherryScore.text = sumCherries < 10 ? "0" + sumCherries : sumCherries.ToString();
        // starScore1.text = sumStar1 < 10 ? "0" + sumStar1 : sumStar1.ToString();
        diamondScore1.text = sumDiamond1 < 10 ? "0" + sumDiamond1 : sumDiamond1.ToString();
        starScore2.text = sumStar2 < 10 ? "0" + sumStar2 : sumStar2.ToString();
        // score_diamante2.text = totalDiamantes2 < 10 ? "0" + totalDiamantes2 : totalDiamantes2.ToString();
        // score_estrella3.text = totalEstrellas3 < 10 ? "0" + totalEstrellas3 : totalEstrellas3.ToString();
    }

    //Funcion para liberar los recursos de los PlayerPrefs
    private void OnDestroy()
    {
        // Liberar recursos aquí
        PlayerPrefs.DeleteKey("items2");
        PlayerPrefs.DeleteKey("estrellas2");

        for (int i = 1; i <= 6; i++)
        {
            PlayerPrefs.DeleteKey("valorrespuesta" + i.ToString());
            PlayerPrefs.DeleteKey("seleccionrespuesta" + i.ToString());
        }

        for (int i = 1; i <= 18; i++)
        {
            PlayerPrefs.DeleteKey("link" + i.ToString());
            PlayerPrefs.DeleteKey("valorImagen" + i.ToString());
        }
        PlayerPrefs.DeleteKey("test");
        PlayerPrefs.DeleteKey("estudiante");
        PlayerPrefs.DeleteKey("token");
    }

}

//Clase para enviar el estudiante y las respuestas del test
[Serializable]
public class StudentAnswers
{
    public string CIstudent;
    public List<Answer> answers;

    public StudentAnswers(string ci, List<string> refs, List<int> values)
    {
        CIstudent = ci;
        answers = new List<Answer>();
        for (int i = 0; i < refs.Count; i++)
        {
            answers.Add(new Answer(refs[i], values[i]));
        }
    }
}

//Clase que obtiene la pregunta (imagen) y su valor
[Serializable]
public class Answer
{
    public string refImages;
    public int valueAnswer;

    public Answer(string refImages, int valueAnswer)
    {
        this.refImages = refImages;
        this.valueAnswer = valueAnswer;
    }
}
