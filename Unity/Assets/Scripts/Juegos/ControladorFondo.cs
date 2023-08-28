using UnityEngine;

public class ControladorFondo : MonoBehaviour
{
    public Renderer background;
    public float speed = 0.015f;

    //Funcion donde renderiza el fondo del juego de plataformas
    private void Update()
    {
        float offsetX = speed * Time.deltaTime;
        Vector2 offset = new Vector2(offsetX, 0);
        background.material.mainTextureOffset += offset;
    }
}
