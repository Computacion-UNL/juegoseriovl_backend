using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class NetworkManager : MonoBehaviour
{       
    private static string url_global = "https://apiseriusgame-production.up.railway.app/api/1.0";
    private string url_login = url_global + "/student/login";
    private string url_test = url_global + "/caso/test/student";
    private string url_images = url_global + "/testImages";
    private string student;
    private string token;
    private static string[] imagesURLs;

    private void Awake()
    {
        // Evitar que el objeto se destruya al cambiar de escena
        DontDestroyOnLoad(gameObject);
    }
    
    private void Start()
    {
        PlayerPrefs.SetString("token", "");
        PlayerPrefs.SetInt("test", 0);
    }

    public void CheckUser(string username, Action<Response> response){
        StartCoroutine(CO_CheckUser(username, response));
    }
    public void CheckTest(){
        StartCoroutine(CO_GetImageURLs(() =>
        {
            int imageCounter = imagesURLs.Length;
            Debug.Log("CANTIDAD IMAGENES>....");
            Debug.Log(imageCounter);
            PlayerPrefs.SetInt("test", (imageCounter >= 18) ? 1 : 0);
            PlayerPrefs.Save();
            Debug.Log((imageCounter >= 18) ? "IMAGENES COMPLETAS" : "IMAGENES INCOMPLETAS");
        })); 
    }

    public void SendTest(string testAnswers, Action<Response> response){
        StartCoroutine(CO_SendTest(testAnswers, response));
    }

    public void GetImage(string imageURL, Image buttonImage){
        StartCoroutine(CO_GetImages(imageURL, buttonImage));
    }

    public void GetImages(Image[] buttonImages, int ref_scene){
        StartCoroutine(CO_GetImagesButtons(buttonImages, ref_scene));
    }

    //Funcion para checker que el jugador exista mediante el código ingresado en el login
    private IEnumerator CO_CheckUser(string username, Action<Response> response)
    {

        UserLogin user = new UserLogin { passwordTemporaly = username };
        string userLogin = JsonUtility.ToJson(user);

        using (var request = new UnityWebRequest(url_login, "POST"))
        {
            byte[] jsonToSend = System.Text.Encoding.UTF8.GetBytes(userLogin);
            request.uploadHandler = new UploadHandlerRaw(jsonToSend);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.ConnectionError)
            {
                Debug.Log(request.error);
                response(new Response { done = false, message = "failed" });
            }
            else
            {
                ResponseData responseData = JsonUtility.FromJson<ResponseData>(request.downloadHandler.text);
                // Debug.Log(responseData);
                student = responseData.data.cedula;
                token = responseData.data.token;
                PlayerPrefs.SetString("estudiante", student);
                PlayerPrefs.SetString("token", token);
                PlayerPrefs.Save();
                response(new Response { done = true, message = request.downloadHandler.text });
            }
        }
    }

    //Funcion para enviar los resultados del test a la plataforma de administracion
    private IEnumerator CO_SendTest(string testAnswers, Action<Response> response)
    {
        using (var request = new UnityWebRequest(url_test, "POST"))
        {
            byte[] jsonToSend = new System.Text.UTF8Encoding().GetBytes(testAnswers);
            request.uploadHandler = new UploadHandlerRaw(jsonToSend);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.ConnectionError)
            {
                // Debug.Log(request.error);
                Debug.Log("Error de conexion");
                response(new Response { done = false, message = "failed" });
            }
            else
            {
                string responseMessage = request.downloadHandler.text;
                response(new Response { done = true, message = responseMessage });
            }
        }
    }

    //Funcion para obtener la imagen y mostrarla en la imagen de los botones
    private IEnumerator CO_GetImages(string imageURL, Image buttonImage)
    {
        using (UnityWebRequest webRequest = UnityWebRequestTexture.GetTexture(imageURL))
        {
            yield return webRequest.SendWebRequest();

            if (webRequest.result == UnityWebRequest.Result.ConnectionError)
            {
                // Debug.Log(webRequest.error);
                Debug.Log("error de conexion");
            }
            else
            {
                Texture2D texture = DownloadHandlerTexture.GetContent(webRequest);
                buttonImage.sprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5f, 0.5f));
            }
        }
    }

    //Funcion para obtener la lista de urls de las imagenes que existen en la API de la plataforma de administracion
    private IEnumerator CO_GetImageURLs(Action onComplete)
    {

        using (UnityWebRequest webRequest = UnityWebRequest.Get(url_images))
        {
            // Debug.Log(PlayerPrefs.GetString("token"));
            if(string.IsNullOrEmpty(PlayerPrefs.GetString("token")))
            {
                Debug.Log("Falta de Token de login");
                yield break;
            }
            else
            {
                webRequest.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));

                yield return webRequest.SendWebRequest();

                if (webRequest.result == UnityWebRequest.Result.ConnectionError)
                {

                    // Debug.Log(webRequest.error);
                    Debug.Log("Imagenes no cargadas");
                    yield break;
                }
                string json = webRequest.downloadHandler.text; 
                Debug.Log("Cargando Imagenes...");
                imagesURLs = ExtractImageLinks(json);
                Debug.Log("Terminando de cargar imagenes");
            }
            onComplete?.Invoke();
        }
    }

    //Funcion para obtener la lista de imagenes dependiendo de la fase (Casa, Arbol y Cuerpo)
    private IEnumerator CO_GetImagesButtons(Image[] buttonImages, int ref_scene)
    {

        Debug.Log("ESCENA IMAGENES>");
        Debug.Log(ref_scene);
  
        int start = 0;
        int end = 0;

        if (ref_scene == 1)
        {
            end = 12;
        }
        else if (ref_scene == 2)
        {
            start = 12;
            end = 18;
        }

        for (int i = start; i < end; i++)
        {
            // Debug.Log(imagenesURLs[i]);
            yield return StartCoroutine(CO_GetImages(imagesURLs[i], buttonImages[i - start]));
            // yield return null;
        }
    }

    //Funcion para extraer las urls de las imagenes del json recibido de la API
    private string[] ExtractImageLinks(string json)
    {
        // Debug.Log(json);

        var data = JsonUtility.FromJson<Data>(json);
        var dataImages = new List<ImageData>();
        var imageLinks = new List<string>();

        foreach (var item in data.data)
        {
            var imageData = new ImageData();
            imageData._id = item._id;
            imageData.name = item.name;
            imageData.link = item.link;
            imageData.value = item.value;
            imageData.section = item.section;
            imageData.createdAt = item.createdAt;
            imageData.updatedAt = item.createdAt;
            dataImages.Add(imageData);
        }
        dataImages.Sort((image1, image2) => image1.section.CompareTo(image2.section));

        for (int i = 0; i < dataImages.Count; i++)
        {
            var image = dataImages[i];
            var url = url_global + image.link;
            PlayerPrefs.SetString("link" + (i+1), url);
            PlayerPrefs.SetInt("valorImagen" + (i+1), image.value);
            // Debug.Log(url);
            imageLinks.Add(url);
        }
        PlayerPrefs.Save();

        Debug.Log("Datos de la lista de imagenes: " + string.Join(", ", imageLinks));

        return imageLinks.ToArray();
    }
}

//Clase para obternes las respuestas de las consultas de la API
[Serializable] 
public class Response{
    public bool done = false;
    public string message = "";
}

//Clase para obternes la lista de imagenes de la API
[Serializable]
public class Data
{
    public List<ImageData> data;
}

//Clase que contiene el formato que tienen las imagenes en la API
[Serializable]
public class ImageData
{
    public string _id;
    public string name;
    public string link;
    public int value;
    public int section;
    public string createdAt;
    public string updatedAt;
}

//Clase para enviar y validar el codigo ingresado en el login a la API 
[Serializable]
public class UserLogin
{
    public string passwordTemporaly;
}


[Serializable]
public class ResponseData
{
    public string message;
    public Data data;

    [Serializable]
    public class Data
    {
        public string cedula;
        public string token;
    }
}
