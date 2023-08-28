using UnityEngine;

public class ControladorItem : MonoBehaviour
{
    //Funcion para detectar si el jugador recoge un item (cereza o diamante) en el juego de plataformas
    private void OnTriggerEnter2D(Collider2D collider)
    {
        if (collider.CompareTag("Jugador"))
        {
            Debug.Log("Item recolectado");
            ControladorMapas.ItemSum();
            Destroy(gameObject);
        }
    }
}
