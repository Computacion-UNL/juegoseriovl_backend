using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemigo : MonoBehaviour
{
    //Variables para el movimiento de los enemigos y sus animaciones
    [SerializeField] private Transform[] movementPoints;
    [SerializeField] private float speed;
    [SerializeField] private GameObject enemyObject;
    [SerializeField] private GameObject death;
    [SerializeField] private GameObject enemy;
    [SerializeField] public bool statusEnemy;

    private int position = 0;

    private Vector3 initialScale, timeScale;
    private float turnRight = 1;

    private void Start()
    {
        initialScale = transform.localScale;
        statusEnemy = true;
    }

    private void Update()
    {
        Movement(statusEnemy);
    }

    //Funcion para realizar el movimiento de los enemigos
    public void Movement(bool estado)
    {
        if(estado == true)
        {
            transform.position = Vector2.MoveTowards(transform.position, movementPoints[position].transform.position, speed * Time.deltaTime);
            if(Vector2.Distance(transform.position, movementPoints[position].transform.position) < 0.1f)
            {
                if(movementPoints[position] != movementPoints[movementPoints.Length - 1]) position++;
                else position = 0;
                turnRight = Mathf.Sign(movementPoints[position].transform.position.x - transform.position.x);
                Giro(turnRight);
            }
        }
    }

    //Funcion para el movimiento de giro del enemigo
    private void Giro(float lado)
    {
        if(turnRight == -1)
        {
            timeScale = transform.localScale;
            timeScale.x = timeScale.x * -1;
        }
        else timeScale = initialScale;

        transform.localScale = timeScale;
    }

    //Funcion para ejecutar la animación de muerte del enemigo
    public void Muere()
    {
        statusEnemy = false;
        enemy.gameObject.SetActive(false);
        StartCoroutine ("WaitDeath");
    }

    //Funcion para activar la animacion de muerte del enemigo y destruir el objeto que contiene al enemigo
    IEnumerator WaitDeath()
    {
        death.gameObject.SetActive(true);
        yield return new WaitForSeconds(1);
        Destroy(enemyObject);
    }

    //Funcion para detectar si el enemigo colisiono con el jugador
    private void OnTriggerEnter2D(Collider2D collider)
    {
        if(collider.gameObject.tag == "Jugador")
        {
            Debug.Log("Danio Hacia el Jugador");
            statusEnemy = false;
            StartCoroutine ("WaitMovement");
        }

    }
    //Funcion para pausar el movimiento del enemigo
    private IEnumerator WaitMovement()
    {
        yield return new WaitForSeconds(1);
        statusEnemy = true;
    }
}
