import tensorflow as tf
from tensorflow import keras 
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

import pandas as pd

# sentences = ["This is BS", "Give me a job"]

# tokenizer = Tokenizer(num_words = 100, oov_token = "<OOV>")

# # training set has to be large so that few words end up as out-of-vocabulary
# tokenizer.fit_on_texts(sentences)
# print(tokenizer.word_index)
# print(pad_sequences(tokenizer.texts_to_sequences(sentences + ["Give me a cat"]), padding="post"))

df = pd.read_csv("./training.1600000.processed.noemoticon.csv")
print(df.shape)