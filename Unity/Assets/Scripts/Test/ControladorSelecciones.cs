using UnityEngine;
using UnityEngine.UI;

public class ControladorSelecciones : MonoBehaviour
{
    [SerializeField] private Image[] images;
    [SerializeField] private int scene;
    private string [] urls;

    private NetworkManager m_networkmanager = null;

    private void Awake()
    {
        m_networkmanager = GameObject.FindObjectOfType<NetworkManager> ();
        FinalImages();
    }

    //Funcion para mostrar las imagenes seleccionadas de la fase Casa y Arbol del test
    public void FinalImages(){

        if (images.Length < 1)
        {
            Debug.LogError("El arreglo de imagenes está vacío.");
            return;
        }

        if(scene==1)
        {
            urls = new string[images.Length];

            for (int i = 0; i < urls.Length; i++)
            {
                urls[i] = PlayerPrefs.GetString("seleccionrespuesta"+(i+1).ToString());
                Debug.Log(urls[i]);
                m_networkmanager.GetImage(urls[i], images[i]);
            }
        }
        else
        {
            urls = new string[images.Length];
            urls[0] = PlayerPrefs.GetString("seleccionrespuesta5");
            urls[1] = PlayerPrefs.GetString("seleccionrespuesta6");
            Debug.Log("URLS ARBOLES");
            Debug.Log(urls[0]);
            Debug.Log(urls[1]);
            m_networkmanager.GetImage(urls[0], images[0]);
            m_networkmanager.GetImage(urls[1], images[1]);
        }
    }    
    
}
