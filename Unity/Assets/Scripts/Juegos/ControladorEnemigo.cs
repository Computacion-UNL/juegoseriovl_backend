using UnityEngine;

public class ControladorEnemigo : MonoBehaviour
{
    [SerializeField] private Transform startPoint;
    [SerializeField] private Transform endPoint;

    //Funcion para el movimiento de los enemigos
    private void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.cyan;
        Gizmos.DrawSphere(startPoint.position, 0.1f);
        Gizmos.DrawSphere(endPoint.position, 0.1f);

    }
}
