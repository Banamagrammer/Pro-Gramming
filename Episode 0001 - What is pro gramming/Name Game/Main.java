import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;

public class Main
{
	public static void main(String[] args) {
		var keepGoing = true;
		var name = "";

		BufferedReader in = new BufferedReader(new InputStreamReader(System.in));

		try {
			while (keepGoing) {
				System.out.println("Provide a name to play the name game, or hit enter to quit:");
				name = in.readLine();

				if (name.length() == 0) {
					keepGoing = false;
					continue;
				}

				var results = playNameGame(capitalize(name));
				System.out.print(results);
			}

			System.out.println("Thanks for playing!");
		}

		catch (IOException ex) {
			System.err.println(String.format("Error reading input: %s", ex.getMessage()));
		}

		finally {
			try {
				in.close();
			} catch (IOException ex) {
				System.err.println(String.format("Error closing stream: %s", ex.getMessage()));
			}
		}
	}

	private static List<Character> vowels = Arrays.asList('a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U');

	private static boolean isVowel(char c) {
		return Character.isLetter(c) && vowels.contains(c);
	}

	private static String capitalize(String word) {
		return String.format("%s%s", word.substring(0, 1).toUpperCase(), word.substring(1));
	}

	private static String getRootName(String name) {
		var firstLetter = name.charAt(0);
		var hasInitialVowel = isVowel(firstLetter);

		return hasInitialVowel
			? name.toLowerCase()
			: name.substring(1);
	}

	private static String playNameGame(String name) {
		var one = getPartOne(name);
		var two = getPartTwo(name);
		var three = getPartThree(name);

		return String.format("\n\n\n******* Let's play the name game! *******\n%s,\n%s,\n%s,\n%s!\n\n\n", one, two, three, name);
	}

	private static String getPartOne(String name) {
		return String.format("%s, %s, bo-b%s", name, name, getRootName(name));
	}

	private static String getPartTwo(String name) {
		return String.format("Bonana-fanna fo-f%s", getRootName(name));
	}

	private static String getPartThree(String name) {
		return String.format("Fee fi mo-m%s", getRootName(name));
	}
}