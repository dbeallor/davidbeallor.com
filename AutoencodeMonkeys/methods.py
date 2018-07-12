import scipy as sp
from scipy import ndimage
import numpy as np
from time import time
import skimage as ski
from skimage import transform
import matplotlib.pyplot as plt
import glob

def squareCrop(img):
	wide = (img.shape[1] > img.shape[0])
	c = int(img.shape[1 if wide else 0] / 2)
	r = int(img.shape[0 if wide else 1] / 2)
	cropped = img[:, c - r : c + r] if wide else img[c - r : c + r, :]
	w = cropped.shape[1]
	h = cropped.shape[0]
	if w > h:
		return cropped[:, :h]
	elif h > w:
		return cropped[:w, :]
	else:
		return cropped

def loadDataset():
	print('Loading images...')
	start_time = time()
	X = []
	y = []
	for i in range(1):
		for filepath in glob.glob('training/n' + str(i) + '/*.jpg'):
			img = squareCrop(sp.ndimage.imread(filepath))
			X.append(ski.transform.resize(img, [116, 116, 3]))
			y.append(i)
		print('  ' + str(i + 1) + '/10 species complete')
	print('  Load time: ' + "{0:.2f}".format(time() - start_time))
	return np.array(X), np.array(y)
