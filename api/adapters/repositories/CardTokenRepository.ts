import { Types } from "mongoose";
import CardToken, { ICardToken } from "../../frameworks/orm/models/CardToken";

export const createCardToken = async (
  cardToken: ICardToken
): Promise<ICardToken> => {
  try {
    const newCardToken = new CardToken(cardToken);
    await newCardToken.save();
    return newCardToken.toObject();
  } catch (error: any) {
    throw new Error(`Error creating card token: ${error.message}`);
  }
};

export const findCardTokenById = async (
  id: string
): Promise<ICardToken | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }
    const cardToken = await CardToken.findById(id);
    return cardToken ? cardToken.toObject() : null;
  } catch (error: any) {
    throw new Error(`Error finding card token by ID: ${error.message}`);
  }
};

export const findCardTokensByUserId = async (
  userId: string
): Promise<ICardToken[]> => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid ID format");
    }
    const cardTokens = await CardToken.find({ userId });
    return cardTokens.map((cardToken) => cardToken.toObject());
  } catch (error: any) {
    throw new Error(`Error finding card tokens by user ID: ${error.message}`);
  }
};

export const findAllCardTokens = async (): Promise<ICardToken[]> => {
  try {
    const cardTokens = await CardToken.find();
    return cardTokens.map((cardToken) => cardToken.toObject());
  } catch (error: any) {
    throw new Error(`Error finding all card tokens: ${error.message}`);
  }
};

export const updateCardToken = async (
  id: string,
  cardToken: Partial<ICardToken>
): Promise<ICardToken | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }
    const updatedCardToken = await CardToken.findByIdAndUpdate(id, cardToken, {
      new: true,
    });
    return updatedCardToken ? updatedCardToken.toObject() : null;
  } catch (error: any) {
    throw new Error(`Error updating card token: ${error.message}`);
  }
};

export const deleteCardToken = async (id: string): Promise<boolean> => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }
    const result = await CardToken.findByIdAndDelete(id);
    return result ? true : false;
  } catch (error: any) {
    throw new Error(`Error deleting card token: ${error.message}`);
  }
};
