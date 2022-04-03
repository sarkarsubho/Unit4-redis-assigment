const express=require("express");

const product=require("../models/product.modle");

const client=require("../configs/redis")


const router=express.Router();

//post('/products')

router.post("",async (req,res)=>{

    try{
        const products=await  product.create(req.body);

        const allproduct= await product.find().lean().exec();

        client.set("products",JSON.stringify(allproduct));

        return res.status(200).send(products);
    }catch(err){
        res.status(500).send({message:err.message});
    }
});

//get('/products')

router.get("",async (req,res)=>{

    try{
        client.get("products", async function(err,featchproducts){
            if(featchproducts){
                const products= JSON.parse(featchproducts);
                 
                
                return res.status(200).send({products,redis:true});
            }else{
                try{
                    const products=await  product.find().lean().exec();


                    client.set("products",JSON.stringify(allproduct));

                    return res.status(200).send({products,redis:false});

                }catch(err){
                     res.status(500).send({message:err.message});
                }
            }
        });

      
    }catch(err){
        res.status(500).send({message:err.message});
    }
});

//get('/products/:id')

router.get("/:id",async (req,res)=>{

    try{
        
        client.get(`products.${req.params.id}`, async function(err,featchproducts){
            if(featchproducts){
                const products= JSON.parse(featchproducts);
                 
                
                return res.status(200).send({products,redis:true});
            }else{
                try{
                    const products=await  product.findById(req.params.id).lean().exec();


                    client.set(`products.${req.params.id}`,JSON.stringify(products));

                    return res.status(200).send({products,redis:false});

                }catch(err){
                     res.status(500).send({message:err.message});
                }
            }
        });


    }catch(err){
        res.status(500).send({message:err.message});
    }
});

//patch('/products/:id')
router.patch("/:id",async (req,res)=>{

    try{

        //findByIdAndUpdate(params id,which want to Update,{new:true}//if want the updated data).lean().exec();
        const products=await  product.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec();

        const allproducts= await product.find().lean().exec();
        client.set(`products.${req.params.id}`,JSON.stringify(products));
        client.set("products",JSON.stringify(allproducts));

        return res.status(200).send(products);
    }catch(err){
        res.status(500).send({message:err.message});
    }
});

//delete('/products/:id')
router.delete("/:id",async (req,res)=>{

    try{

        //findByIdAndUpdate(params id,which want to Update,{new:true}//if want the updated data).lean().exec();
        const products=await  product.findByIdAndDelete(req.params.id).lean().exec();

        const allproducts= await product.find().lean().exec();

        client.del(`products.${req.params.id}`);
        client.set("products",JSON.stringify(allproducts));
        return res.status(200).send(products);
    }catch(err){
        res.status(500).send({message:err.message});
    }
});



module.exports=router;