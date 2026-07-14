# 📥 Airtable Import Guide for KidSpark

I've created CSV files with all the content you need! Follow these steps to import them into Airtable.

---

## 📁 Files Included

| File | Content | Records |
|------|---------|---------|
| `Animals.csv` | 🦁 Animals to learn | 40 animals |
| `Fruits.csv` | 🍎 Fruits to learn | 25 fruits |
| `Vegetables.csv` | 🥕 Vegetables to learn | 25 vegetables |
| `Shapes.csv` | 🔺 Shapes to learn | 20 shapes |
| `Colors.csv` | 🌈 Colors to learn | 20 colors |
| `Vehicles.csv` | 🚗 Vehicles to learn | 25 vehicles |
| `Birds.csv` | 🦅 Birds to learn | 25 birds |
| `BodyParts.csv` | 🧠 Body parts to learn | 25 body parts |
| `Alphabet.csv` | 🔤 Letters A-Z | 26 letters |
| `Numbers.csv` | 🔢 Numbers | 23 numbers |
| `QuizQuestions.csv` | ❓ Quiz questions | 65+ questions |
| `WordBuilder.csv` | 📝 Words to spell | 80+ words |

**Total: 400+ pieces of content!** 🎉

---

## 🚀 How to Import

### Step 1: Open Airtable
Go to [airtable.com](https://airtable.com) and create a new base called **"KidSpark Content"**

### Step 2: Import Each CSV File

For each CSV file:

1. **Click "+ Add or import"** (at the bottom of the table list)
2. **Select "CSV file"**
3. **Upload the CSV file** (e.g., `Animals.csv`)
4. **Airtable will automatically:**
   - Create the table
   - Set up all the columns
   - Import all the data!

5. **Rename the table** to match the file name (e.g., "Animals")

### Step 3: Repeat for All Files

Import in this order:
1. Animals.csv → rename table to "Animals"
2. Fruits.csv → rename table to "Fruits"
3. Vegetables.csv → rename table to "Vegetables"
4. Shapes.csv → rename table to "Shapes"
5. Colors.csv → rename table to "Colors"
6. Vehicles.csv → rename table to "Vehicles"
7. Birds.csv → rename table to "Birds"
8. BodyParts.csv → rename table to "BodyParts"
9. Alphabet.csv → rename table to "Alphabet"
10. Numbers.csv → rename table to "Numbers"
11. QuizQuestions.csv → rename table to "QuizQuestions"
12. WordBuilder.csv → rename table to "WordBuilder"

---

## 🔑 Get Your API Key

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click **"Create new token"**
3. Settings:
   - **Name:** KidSpark App
   - **Scopes:** 
     - ✅ `data.records:read`
     - ✅ `schema.bases:read`
   - **Access:** Select your "KidSpark Content" base
4. Click **"Create token"**
5. **Copy the token** (starts with `pat...`)

### Get Base ID
Look at your Airtable URL:
```
https://airtable.com/appXXXXXXXXXXXXXX/...
                     ^^^^^^^^^^^^^^^^
                     This is your Base ID
```

---

## ⚙️ Configure Your App

Create a `.env` file in your project:

```env
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXXXXXXXX
VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

Or set these in your hosting platform (Vercel, Netlify).

---

## ✅ Test the Connection

1. Run your app: `npm run dev`
2. Go to **Settings** ⚙️
3. Look for the green dot: 🟢 **"Connected to Airtable"**

---

## ✏️ Adding New Content

Once set up, just add rows in Airtable! Examples:

### Add a New Animal
Go to the Animals table and add a row:
| id | name | emoji | funFact |
|----|------|-------|---------|
| unicorn | Unicorn | 🦄 | Unicorns are magical horses with horns! |

### Add a New Quiz Question
Go to QuizQuestions table:
| question | emoji | option1 | option2 | option3 | option4 | correctAnswer | category |
|----------|-------|---------|---------|---------|---------|---------------|----------|
| Which animal has a trunk? | 🐘 | Lion | Giraffe | Elephant | Bear | 3 | animals |

### Add a New Word
Go to WordBuilder table:
| word | emoji | hint |
|------|-------|------|
| HAPPY | 😊 | How you feel when something good happens |

---

## 🔄 Refresh Content

After adding content in Airtable:
1. Open KidSpark app
2. Go to **Settings**
3. Click **"🔄 Refresh content"**

Your new content is now live! 🎉

---

## 💡 Tips

- **Emoji:** Use standard emoji that work on all devices
- **Fun Facts:** Keep them short and interesting for kids
- **Words:** Start with 3-4 letter words, then add longer ones
- **Quiz:** Make sure `correctAnswer` is 1-4 (not 0-3)

---

## 🆘 Troubleshooting

**"Using offline content" instead of "Connected to Airtable"?**
- Check your API key is correct
- Check your Base ID is correct
- Make sure the token has the right permissions

**Content not updating?**
- Click "🔄 Refresh content" in Settings
- Check the browser console for errors

**Emoji not showing?**
- Use standard emoji, not custom icons
- Test on different devices

---

## 📱 Need Help?

- Check the browser console (F12) for error messages
- Verify your Airtable tables match the expected column names exactly
- Make sure all required columns exist in each table

Happy teaching! 🎓✨
