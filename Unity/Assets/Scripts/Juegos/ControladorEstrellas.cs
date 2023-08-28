using UnityEngine;

public class ControladorEstrellas : MonoBehaviour
{
    //Funcion para detectar si el jugador recoge una estrella en el juego de plataformas
    private void OnTriggerEnter2D(Collider2D collider)
    {
        if (collider.CompareTag("Jugador"))
        {
            Debug.Log("Estrella Recolectada");
            ControladorMapas.StarSum();
            Destroy(gameObject);
        }
    }
}
