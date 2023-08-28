using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ControladorImagenes : MonoBehaviour
{

    [SerializeField] private Button[] buttons;
    private Image[] images;

    private NetworkManager m_networkmanager = null;

    private void Awake()
    {
        m_networkmanager = GameObject.FindObjectOfType<NetworkManager>();
        GetButtonImages();
    }

    private void Start()
    {
        int scene = images.Length;
        int imagesParameter = 2; // Valor predeterminado

        switch (scene)
        {
            case 12:
                imagesParameter = 1;
                break;
        }
        Debug.Log("Cargando imagenes");
        m_networkmanager.GetImages(images, imagesParameter);
    }

    //Funcion para obtener las imagenes para cada boton del test
    public void GetButtonImages()
    {
        // Verificar que el tamaño del arreglo de botones sea mayor que cero
        if (buttons.Length < 1)
        {
            Debug.LogError("El arreglo de botones está vacío.");
            return;
        }

        // Inicializar el arreglo de imágenes
        images = new Image[buttons.Length];

        // Obtener las imágenes correspondientes a cada botón
        for (int i = 0; i < buttons.Length; i++)
        {
            images[i] = buttons[i].GetComponent<Image>();
        }
    }

    //Funcion para recargar las imagenes en los botones del test
    public void GetButtonImagesUpdate(Button Buton)
    {
        int scene = images.Length;
        int imagesParameter = 2; // Valor predeterminado

        switch (scene)
        {
            case 12:
                imagesParameter = 1;
                break;
        }
        StartCoroutine(ImagesLoad(Buton, imagesParameter));
    }

    //Funcion para cargar las imagenes en los botones del test
    private IEnumerator ImagesLoad(Button Buton, int imagesParameter)
    {
        Buton.interactable = false;
        Debug.Log("Cargando Imagenes...");
        m_networkmanager.CheckTest();
        yield return new WaitForSeconds(5);
        m_networkmanager.GetImages(images, imagesParameter);
        Buton.interactable = true;
        Debug.Log("Terminando de cargar imagenes");
    }
}
