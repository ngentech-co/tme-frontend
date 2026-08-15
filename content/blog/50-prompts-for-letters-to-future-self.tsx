export default function PromptsForLetters() {
  const prompts = [
    'What are you working on right now? Why?',
    'What are you most afraid of at this moment?',
    'What do you wish you had more time for?',
    'Who do you miss, and what do you miss about them?',
    'What was the last thing that made you laugh?',
    'What small thing are you grateful for today?',
    'If you could change one decision from the past year, what would it be?',
    'What do you think the world will look like in 10 years?',
    'What\'s something you believe now that you didn\'t believe 5 years ago?',
    'What does your daily routine look like?',
    'What song have you been listening to on repeat?',
    'What\'s the kindest thing someone did for you recently?',
    'What are you reading, watching, or playing?',
    'What are you proudest of?',
    'What are you most uncertain about?',
    'What does your home feel like right now? What can you smell?',
    'What do you want your future self to remember about this period of your life?',
    'If you could send one piece of advice to yourself in 10 years, what would it be?',
    'What habits are you trying to build? Which ones are working?',
    'What does friendship mean to you right now?',
    'What did you used to love that you\'ve stopped doing?',
    'What do you love most about your work — or your lack of work?',
    'What does your body feel like today? Are you taking care of it?',
    'What makes you feel most alive?',
    'When did you last cry, and why?',
    'What\'s something you want to forgive yourself for?',
    'Who do you want to thank?',
    'What\'s something you haven\'t told anyone?',
    'What does "success" mean to you today? Has it changed from last year?',
    'What\'s the most beautiful thing you\'ve seen recently?',
    'What\'s a question you\'re sitting with?',
    'What would you do if you weren\'t afraid?',
    'What kind of person are you becoming?',
    'What\'s the difference between who you are and who you want to be?',
    'What\'s a memory you keep coming back to?',
    'What do you want to create in the next year?',
    'What does money mean to you right now?',
    'What\'s the best meal you\'ve had recently?',
    'What\'s a piece of art that changed you?',
    'Where do you feel most yourself?',
    'What\'s a lie you tell yourself?',
    'What\'s a truth you keep avoiding?',
    'Who do you want to be when you grow up?',
    'What does love look like in your life right now?',
    'What does your relationship with your family feel like?',
    'What would you do if you had a year off?',
    'What\'s the most embarrassing thing on your phone right now?',
    'What\'s something you want to apologize for?',
    'What\'s something you want to be remembered for?',
    'What is one small thing you can do tomorrow to take care of yourself?',
    'What does home mean to you?',
  ];

  return (
    <>
      <p>
        A letter to your future self is one of the most personal things you can write.
        But staring at an empty page is hard. These prompts are here to help you start.
        Pick the ones that pull at something in your chest.
      </p>

      <p>
        You don't need to answer all of them. Pick three or four. Or just one. Write for
        ten minutes without editing. Seal it for a year, five years, twenty. Forget
        about it.
      </p>

      <h2>Prompts</h2>

      <ol>
        {prompts.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>

      <h2>A note on tone</h2>

      <p>
        Write like you're writing to a friend. Not a stranger, not a therapist, not a
        biographer. A friend who happens to be you, ten years from now. Be honest.
        Be kind. Don't try to be wise. Just be specific.
      </p>
    </>
  );
}
