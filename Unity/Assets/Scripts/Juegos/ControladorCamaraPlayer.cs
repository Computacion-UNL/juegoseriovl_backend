using UnityEngine;

public class ControladorCamaraPlayer : MonoBehaviour
{
    [SerializeField] private GameObject player;

    //Funcion para dar movimiento a la camara con el movimiento del personaje del juego de plataformas
    private void Update()
    {
        Vector3 newPosition = player.transform.position;
        newPosition.z = transform.position.z;
        transform.position = newPosition;
    }
}
