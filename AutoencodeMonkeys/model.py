from methods import squareCrop, loadDataset
import scipy as sp
from scipy import ndimage
import numpy as np
import sklearn as skl
from sklearn import model_selection
from time import time
import skimage as ski
from skimage import transform
import matplotlib.pyplot as plt
import glob
from keras.layers import Input, Dense, Conv2D, MaxPooling2D, UpSampling2D
from keras.models import Model
from keras import backend as K

X, y = loadDataset()

X_train, X_test, y_train, y_test = skl.model_selection.train_test_split(X, y, test_size=0.33, random_state=42)

# plt.imshow(X[int(np.random.uniform(0, len(X)))])
# plt.show()

input_img = Input(shape=X[0].shape)  # adapt this if using `channels_first` image data format

x = Conv2D(16, (3, 3), activation='relu', padding='same')(input_img)
x = MaxPooling2D((2, 2), padding='same')(x)
x = Conv2D(8, (3, 3), activation='relu', padding='same')(x)
x = MaxPooling2D((2, 2), padding='same')(x)
x = Conv2D(8, (3, 3), activation='relu', padding='same')(x)
encoded = MaxPooling2D((2, 2), padding='same')(x)

# at this point the representation is (4, 4, 8) i.e. 128-dimensional

x = Conv2D(8, (3, 3), activation='relu', padding='same')(encoded)
x = UpSampling2D((2, 2))(x)
x = Conv2D(8, (3, 3), activation='relu', padding='same')(x)
x = UpSampling2D((2, 2))(x)
x = Conv2D(16, (3, 3), activation='relu')(x)
x = UpSampling2D((2, 2))(x)
decoded = Conv2D(3, (3, 3), activation='sigmoid', padding='same')(x)

autoencoder = Model(input_img, decoded)
autoencoder.compile(optimizer='adadelta', loss='binary_crossentropy')

autoencoder.fit(X_train, X_train
                ,epochs=100
                ,batch_size=128
                ,shuffle=True
                ,validation_data=(X_test, X_test)
                # ,callbacks=[TensorBoard(log_dir='/tmp/tb', histogram_freq=0, write_graph=False)]
            	)