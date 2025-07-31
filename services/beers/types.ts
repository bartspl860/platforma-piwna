export enum BeerCategoryEnum {
	SMAKOWE = 'SMAKOWE',
	NIESMAKOWE = 'NIESMAKOWE'
}

export interface Beer {
	id: string;
	name: string;
	alcohol: number;
	price?: number;
	category: BeerCategoryEnum;
	image?: string;
	createdAt: string;
	updatedAt: string;
}
