using System;

class Program
{
    static void Main()
    {
        Console.ForegroundColor = ConsoleColor.Magenta;
        Console.WriteLine("       @@@");
        Console.WriteLine("      @@@@@");
        Console.WriteLine("       @@@");
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("        |");
        Console.WriteLine("    \\   |   /");
        Console.WriteLine("     \\  |  /");
        Console.WriteLine("      \\ | /");
        Console.WriteLine("       \\|/");
        Console.WriteLine("        |");
        Console.WriteLine("        |");
        Console.WriteLine("        |");
        Console.ResetColor();

        Console.WriteLine("\nPressione qualquer tecla para sair...");
        Console.ReadKey();
    }
}