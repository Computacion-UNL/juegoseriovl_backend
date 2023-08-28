
using UnityEngine;
using System.Collections;

public class ControladorPlayer : MonoBehaviour
{   
    //Variables para la configuración del jugador en el juego de plataformas
    [SerializeField] public float Speed;
    [SerializeField] public float jumpHeight;
    [SerializeField] public float jumpPower;
    [SerializeField] private float gravity;
    [SerializeField] private int phase1;
    [SerializeField] private int phase2;
    [SerializeField] public bool jumping;
    [SerializeField] public float fallen;
    [SerializeField] public Animator animator;
    [SerializeField] private float yPosition;
    [SerializeField] private int sky;
    [SerializeField] private Vector3 endPosition;
    [SerializeField] public Rigidbody2D rPlayer;
    [SerializeField] public CapsuleCollider2D ccPlayer;

    //Posiciones para la reaparición del jugador
    [SerializeField] private float positionX;
    [SerializeField] private float positionY;
    [SerializeField] private float positionZ;

    [SerializeField] private bool movement;

    //Variables para detectar el piso
    [SerializeField] private RaycastHit2D hit;
    [SerializeField] public Vector3 v3;
    [SerializeField] public float distance;
    [SerializeField] public LayerMask layer;

    //Variables para detectar el estado del jugador si salta, camina a la derecha o izquierda
    private Enemigo m_enemigo = null;
    bool isLeft = false;
    bool isRight = false;
    bool isJump = false;

    private void Start()
    {
        rPlayer = GetComponent<Rigidbody2D>();
        ccPlayer = GetComponent<CapsuleCollider2D>();
        movement = true;
    }

    void Awake()
    {
        animator = GetComponent<Animator>();
        m_enemigo = GameObject.FindObjectOfType<Enemigo> ();
    }

    //Funcion para detectar si el jugador colisiono con algun objeto del juego
    public bool CheckCollision
    {
        get
        {
            hit = Physics2D.Raycast(transform.position + v3, transform.up * -1, distance, layer);
            return hit.collider != null;
        }
    }

    //Funcion para detectar la plataforma en la que esta el jugador
    public void Detector_Plataforma()
    {
        if(CheckCollision)
        {
            animator.SetBool("jump", false);
            sky = 0;
            if(!jumping)
            {
                gravity = 0;
                phase1 = 0;
                phase2 = 0;
            }
        }
        else
        {
            animator.SetBool("jump", true);
            if(!jumping)
            {
                switch(phase2)
                {
                    case 0:
                        gravity = 0;
                        phase1 = 0;
                        break;
                    case 1:
                        if(gravity > -10)
                        {
                            gravity -= jumpHeight / fallen * Time.deltaTime;
                        }
                        break;
                }
            }
        }

        if(transform.position.y > yPosition)
        {
            animator.SetFloat("gravedad", 1);
        }

        if(transform.position.y < yPosition)
        {
            animator.SetFloat("gravedad", 0);
            switch(sky)
            {
                case 0:
                    animator.Play("Base Layer.Jump", 0, 0f);
                    sky++;
                    break;
            }
        }
        yPosition = transform.position.y;
    }

    //Funciones para detectar si presiono los botones a la izquierda, derecha y salto
    public void ClickLeft()
    {
        isLeft = true;
    }

    public void ReleaseLeft()
    {
        isLeft = false;
    }

    public void ClickRight()
    {
        isRight = true;
    }

    public void ReleaseRight()
    {
        isRight = false;
    }

    public void ClickJump()
    {
        isJump = true;
    }

    //Funcion para el movimiento del jugador
    public void Move()
    {
        if(Input.GetKey(KeyCode.D) || isRight == true)
        {
            transform.Translate(Vector3.right * Speed * Time.deltaTime);
            transform.rotation = Quaternion.Euler(0,0,0);
            animator.SetBool("run", true);
        }
        else
        {
            animator.SetBool("run", false);
        }

        if(Input.GetKey(KeyCode.A) || isLeft == true)
        {
            transform.Translate(Vector3.right * Speed * Time.deltaTime);
            transform.rotation = Quaternion.Euler(0,180,0);
            animator.SetBool("run", true);
        }
    }

    //Funcion para la accion de salto del jugador
    public void Jump()
    {
        if(Input.GetKey(KeyCode.W) || isJump == true)
        {
            switch(phase1)
            {
                case 0:
                    if(CheckCollision)
                    {
                        gravity = jumpHeight;
                        phase1 = 1;
                        jumping = true;
                    }
                    break;
                case 1:
                    if(gravity > 0)
                    {
                        gravity -= jumpPower * Time.deltaTime;
                    }
                    else
                    {
                        phase1 = 2;
                    }
                    jumping = true;
                    break;
                case 2:
                    jumping = false;
                    isJump = false;
                    break;
            }
        }
        else
        {
            jumping = false;
            isJump = false;
        }
    }

    //Funcion para guardar la posicion del jugador
    private void GuardarPosicion()
    {   
        PlayerPrefs.SetFloat("posx", transform.position.x);
        PlayerPrefs.SetFloat("posy", transform.position.y);
        PlayerPrefs.SetFloat("posz", transform.position.z);
        Debug.Log("Posicion Guardado Correctamente");
    }

    //Funcion para detectar las colisiones que guardaran la ultima posicion del jugador
    private void OnTriggerEnter2D(Collider2D collider)
    {
        switch (collider.gameObject.tag)
        {
            case "ArbolesReinicio":
                Debug.Log("Posicion Guardada");
                GuardarPosicion();
                break;
            case "Pinchos":
                Debug.Log("Daño del Jugador");
                movement = false;
                StartCoroutine ("Esperar");
                break;
            case "Enemigo":
                Debug.Log("Daño del Jugador");
                gravity = 0;
                movement = false;
                StartCoroutine("Esperar");
                break;

            case "Menemigo":
                Debug.Log("Muerte enemigo");
                collider.gameObject.SendMessage("Muere");
                break;
        }
    }

    //Funcion para reaparecer el jugador en la ultima posición guardada una vez haya muerto
    private void Reaparecer()
    {
        rPlayer.velocity = Vector3.zero;
        positionX = PlayerPrefs.GetFloat("posx");
        positionY = PlayerPrefs.GetFloat("posy");
        positionZ = PlayerPrefs.GetFloat("posz");

        endPosition.x = positionX;
        endPosition.y = positionY;
        endPosition.z = positionZ;

        transform.position = endPosition;
        animator.SetBool("enemigo", false);
        movement = true;
    }

    //Funcion para ejecutar la animación de reaparecer del jugador
    private IEnumerator Esperar()
    {
        animator.SetBool("enemigo", true);
        yield return new WaitForSeconds(1);
        Reaparecer();
    }

    //Funcion que detecta el constante movimiento y salto del jugador
    void FixedUpdate()
    {
        if(movement == true)
        {
            Move();
            Jump();
        }
    }

    //Funcion que detecta constantemente la plataforma
    void Update()
    {
        Detector_Plataforma();
        transform.Translate(Vector3.up * gravity * Time.deltaTime);
    }
}
