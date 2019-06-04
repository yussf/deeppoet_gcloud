import re, psycopg2, os
from fastai.text import load_learner
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

path = Path(__file__).parent
learn = load_learner("./", path/'models/deep_poet')
URI = os.getenv("URI")
def generate_poem(init,length,temp):
  return learn.predict(init, n_words=length, temperature=temp)

def getMax(poem):
  poem = re.sub('\n',"",poem)
  list = poem.split(" ")
  occ = {}
  max = 0
  for word in list:
    if len(word) > 3  :
      occ[word] = occ.get(word,0) + 1
      if occ[word] > max : max = occ[word]
  return max

def savePoem(poem, init, length, temp, counter, repetition_tolerance):
  connection = psycopg2.connect(URI) #.env uri
  cursor = connection.cursor()
  args = [poem, init, length, temp, counter, repetition_tolerance]
  cursor.execute("INSERT INTO poems VALUES (default, %s, %s, %s, %s, %s, %s)", args)
  connection.commit()

def write_poem(init, temp=0.55, length=100, repetition_tolerance=8, max=10):
  counter = 0
  poem = generate_poem(init,length,temp)
  while getMax(poem)>= repetition_tolerance :
      counter += 1
      poem = generate_poem(init,length,temp)
      if (counter > max) : break
  poem = re.sub(' i ', ' I ', poem)
  verses = poem.split("\n")
  for i in range(len(verses)):
      verses[i] = verses[i].strip()
      if len(verses[i]) > 1: verses[i] = verses[i][0].upper() + verses[i][1:]
      elif len(verses[i]) == 1 : verses[i] = verses[i].upper()
  poem = "<br>".join(verses)
  savePoem(poem, init, length, temp, counter, repetition_tolerance)
  return poem
